class SseNotificationsController < ApplicationController
  include ActionController::Live

  # Notes
  #
  # 1. The Redis subscribe is a blocking call. This means the controller can't
  #    do anything else while waiting for messages.
  # 2. Since this is an event stream, the client won't receive a final http response until the connection is closed.
  # 3. If the server disconnects the stream via the controller action completing, most clients (browsers) will attempt
  #    to reconnect, therefore invoking a connection loop. This is why we don't complete the connection immediately
  #    and instead create a blocking process (loop).
  # 4. The client can disconnect without the server being aware of it immediately.
  #    This results in abandoned server threads which can hang the server.
  # 5. The server cannot be closed with ^c while stream connections are open.
  # 6. To ensure the server closes connections after the client leaves, a heartbeat loop is implemented
  #    to check the client every 5 seconds. If the client does not receive the heartbeat message,
  #    an exception is raised.
  # 7. We rescue the exception, but fallback to the ensure logic which closes the stream and redis listener.
  #    This would still work without the rescue, but the rescue allows the controller to return a 200 status.

  def index
    response.headers['Content-Type'] = 'text/event-stream'
    sse = SSE.new(response.stream, retry: 300, event: 'notifications')

    redis_thread = Thread.new do
      NotificationRedis.redis.subscribe("notifications_#{current_user.id}") do |on|
        on.message do |_channel, message|
          sse.write({ data: message })
        end
      end
    end

    loop do
      sse.write({ event: 'heartbeat', data: 'ping' })
      sleep 5
    end
  rescue ActionController::Live::ClientDisconnected
  ensure
    redis_thread&.kill
    sse.close
  end
end
