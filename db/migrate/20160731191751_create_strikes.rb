class CreateStrikes < ActiveRecord::Migration[5.0]
  def change
    create_table :strikes do |t|
      t.string :date
      t.string :location
      t.string :narrative
      t.string :deaths
      t.string :civilians
      t.string :names
      t.string :report
    end
  end
end
