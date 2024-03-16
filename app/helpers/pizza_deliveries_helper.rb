module PizzaDeliveriesHelper
  def pizza_delivery_location(pizza_delivery)
    "#{pizza_delivery.city}, #{pizza_delivery.state}"
  end

  def page_range(page, page_count)
    range_start = [1, page - 5].max
    range_end = [[page + 5, page_count].min, 1].max
    (range_start..range_end).to_a
  end

  def states_list
    [
      OpenStruct.new(id: 'AL', name: 'Alabama'),
      OpenStruct.new(id: 'AK', name: 'Alaska'),
      OpenStruct.new(id: 'AZ', name: 'Arizona'),
      OpenStruct.new(id: 'AR', name: 'Arkansas'),
      OpenStruct.new(id: 'CA', name: 'California'),
      OpenStruct.new(id: 'CO', name: 'Colorado'),
      OpenStruct.new(id: 'CT', name: 'Connecticut'),
      OpenStruct.new(id: 'DE', name: 'Delaware'),
      OpenStruct.new(id: 'DC', name: 'District of Columbia'),
      OpenStruct.new(id: 'FL', name: 'Florida'),
      OpenStruct.new(id: 'GA', name: 'Georgia'),
      OpenStruct.new(id: 'HI', name: 'Hawaii'),
      OpenStruct.new(id: 'ID', name: 'Idaho'),
      OpenStruct.new(id: 'IL', name: 'Illinois'),
      OpenStruct.new(id: 'IN', name: 'Indiana'),
      OpenStruct.new(id: 'IA', name: 'Iowa'),
      OpenStruct.new(id: 'KS', name: 'Kansas'),
      OpenStruct.new(id: 'KY', name: 'Kentucky'),
      OpenStruct.new(id: 'LA', name: 'Louisiana'),
      OpenStruct.new(id: 'ME', name: 'Maine'),
      OpenStruct.new(id: 'MD', name: 'Maryland'),
      OpenStruct.new(id: 'MA', name: 'Massachusetts'),
      OpenStruct.new(id: 'MI', name: 'Michigan'),
      OpenStruct.new(id: 'MN', name: 'Minnesota'),
      OpenStruct.new(id: 'MS', name: 'Mississippi'),
      OpenStruct.new(id: 'MO', name: 'Missouri'),
      OpenStruct.new(id: 'MT', name: 'Montana'),
      OpenStruct.new(id: 'NE', name: 'Nebraska'),
      OpenStruct.new(id: 'NV', name: 'Nevada'),
      OpenStruct.new(id: 'NH', name: 'New Hampshire'),
      OpenStruct.new(id: 'NJ', name: 'New Jersey'),
      OpenStruct.new(id: 'NM', name: 'New Mexico'),
      OpenStruct.new(id: 'NY', name: 'New York'),
      OpenStruct.new(id: 'NC', name: 'North Carolina'),
      OpenStruct.new(id: 'ND', name: 'North Dakota'),
      OpenStruct.new(id: 'OH', name: 'Ohio'),
      OpenStruct.new(id: 'OK', name: 'Oklahoma'),
      OpenStruct.new(id: 'OR', name: 'Oregon'),
      OpenStruct.new(id: 'PA', name: 'Pennsylvania'),
      OpenStruct.new(id: 'RI', name: 'Rhode Island'),
      OpenStruct.new(id: 'SC', name: 'South Carolina'),
      OpenStruct.new(id: 'SD', name: 'South Dakota'),
      OpenStruct.new(id: 'TN', name: 'Tennessee'),
      OpenStruct.new(id: 'TX', name: 'Texas'),
      OpenStruct.new(id: 'UT', name: 'Utah'),
      OpenStruct.new(id: 'VT', name: 'Vermont'),
      OpenStruct.new(id: 'VA', name: 'Virginia'),
      OpenStruct.new(id: 'WA', name: 'Washington'),
      OpenStruct.new(id: 'WV', name: 'West Virginia'),
      OpenStruct.new(id: 'WI', name: 'Wisconsin'),
      OpenStruct.new(id: 'WY', name: 'Wyoming'),
    ]
  end
end
