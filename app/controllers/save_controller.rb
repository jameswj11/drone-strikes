class SaveController < ApplicationController
  def index
    render :json => Strike.all
  end

  def show
    render :json => Strike.find(params[:id])
  end

  def create
    strike = {date: params[:date], location: params[:location], narrative: params[:narrative], deaths: params[:deaths], civilians: params[:civilians], names: params[:names], report: params[:report]}
    Strike.create strike
    render :json => Strike.last
  end

  def destroy
    strike = Strike.find(params[:id])
    if strike
      strike.destroy
      render :json => {:deleted => true} if strike
    else
      render :json => {:deleted => false}
    end
  end

end
