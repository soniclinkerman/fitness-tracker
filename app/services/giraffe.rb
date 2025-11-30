# class Vehicle
#   attr_reader :type, :spots_needed, :allowed_spot_types
#
#   def initialize(type, spots_needed, allowed_spot_types)
#     @type = type
#     @spots_needed = spots_needed
#     @allowed_spot_types = allowed_spot_types
#   end
#
# end
#
# class Motorcycle < Vehicle
#   def initialize
#     super(:motorcycle, 1, [:motorcycle, :compact, :large])
#   end
# end
#
# class Car < Vehicle
#   def initialize
#     super(:car, 1, [:compact, :large])
#   end
# end
#
# class Van < Vehicle
#   def initialize
#     super(:van, 3, [:large])
#   end
# end
#
# class Spot
#   attr_reader(:type, :occupied_by)
#
#   def initialize(type)
#     @type = type
#     @occupied_by = nil
#   end
#
#   def park(vehicle)
#     return false unless free?
#     @occupied_by=vehicle
#     true
#   end
#
#   def free?
#     @occupied_by.nil?
#   end
#
#   def leave
#     @occupied_by=nil
#   end
# end
#
# class ParkingLot
#   def initialize(motorcycle_spots, compact_spots,large_spots)
#     @spots = []
#     motorcycle_spots.times { @spots << Spot.new(:motorcycle) }
#     compact_spots.times    { @spots << Spot.new(:compact) }
#     large_spots.times      { @spots << Spot.new(:large) }
#   end
#
#   def total_spots
#     @spots.count
#   end
#
#   def large_spot_count
#     count = 0
#     @spots.each do |spot|
#       count+=1 if spot.type== :large and spot.free?
#     end
#     count
#   end
#
#
#   def remaining_spots
#     count = 0
#     @spots.each do |spot|
#         count+=1 if spot.free?
#     end
#     count
#   end
#
#   def full?
#     @spots.all? { |spot| !spot.free? }
#   end
#
#   def empty?
#     @spots.all? { |spot| spot.free? }
#   end
#
#   def park(vehicle)
#     if vehicle.type  == :van
#       count = 0
#       starting_index = nil
#       @spots.each_with_index do |spot,idx|
#         if spot.free? && vehicle.allowed_spot_types.include?(spot.type)
#           count +=1
#           starting_index = idx if starting_index.nil?
#         else
#           count = 0
#           starting_index = nil
#         end
#
#         if count == 3
#           3.times do |offset|
#             @spots[starting_index + offset].park(vehicle)
#           end
#           return true
#         end
#       end
#       false
#
#
#     else
#       @spots.each do |spot|
#         if spot.free? && vehicle.allowed_spot_types.include?(spot.type)
#           spot.park(vehicle)
#           return true
#         end
#       end
#       return false
#     end
#
#   end
#
#   def van_spots_taken
#     count = 0
#     @spots.each do |spot|
#       if spot.type == :large && !spot.free? && spot.occupied_by.type == :van
#         count+=1
#       end
#     end
#     count / 3
#   end
#
#   def vehicle_spots_full?(type)
#     @spots.each do |spot|
#       if spot.type == type && spot.free?
#         return false
#       end
#     end
#     true
#   end
# end
#
# parking_lot =ParkingLot.new(1,2,3)
# motorcycle = Motorcycle.new
# car = Car.new
# van = Van.new
# parking_lot.park(motorcycle)
# parking_lot.park(car)
#
# p parking_lot.vehicle_spots_full?(:motorcycle)
# p parking_lot.vehicle_spots_full?(:large)
# p parking_lot.vehicle_spots_full?(:compact)

# def even_numbers(arr)
#   even_numbers = []
#   arr.each do |num|
#     even_numbers << num if num % 2 == 0
#   end
#   even_numbers
# end
#
#
# p even_numbers([1,2,3,4,5,6,7,8,9,10])

completed_session = WorkoutSession
                      .where(user_id: user.id)
                      .where(program_id: program.id)
                      .where(archived_at: nil)
                      .where.not(completed_at: nil)
                      .order(completed_at: :desc)
                      .first

if completed_session.nil?

end

completed_day = completed_session.workout_day_session.workout_day
program =completed_session.program
ordered_days = program.workout_days.sort_by(&:day_number)
index = ordered_days.index(completed_day)
next_day = ordered_days[index+1]
if next_day
  {
    next_day_unlocked: true,
    next_workout_day_id: next_day.id,
    next_day_number: next_day.day_number
  }
elsif next_day.nil?
  {
    next_day_unlocked: false,
    program_completed: true
  }
end