class StrikesController < ApplicationController
  def index
    url = "http://api.dronestre.am/data"
    response = HTTParty.get(url)
    parsed_body = JSON.parse(response.body)
    render json: parsed_body["strike"]
  end
end
