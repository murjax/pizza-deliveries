module NotificationRedis
  def self.redis
    @redis ||= ConnectionPool::Wrapper.new { Redis.new }
  end
end
