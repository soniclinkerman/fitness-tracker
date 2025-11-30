# Create a Ruby class called Person with attributes name and age.
# Implement a custom setter method for the age attribute that restricts the age to be within a specific range
# (e.g., 0 to 120).

# class Person
#   attr_reader :name, :age
#
#   def initialize(name, age)
#     @name = name
#     self.age = age
#   end
#
#   def age=(new_age)
#     if new_age < 0 || new_age > 120
#       raise ArgumentError, "Age must be between 0 and 120"
#     end
#     @age = new_age
#     true
#   end
# end
#
# person_1 = Person.new("Zay", 11)
# p person_1.age

# def common_element(input)
#   seen = {}
#   frequent = [0,0]
#   input.each do |num|
#     seen[num] ||= 0
#     seen[num]+=1
#     if seen[num] > frequent[1]
#       frequent=[num, seen[num]]
#     end
#   end
#   p frequent
#   frequent[0]
# end
# p common_element([1, 2, 2, 3, 3, 3, 4, 4, 4, 4])

require 'date'

contacts = [
  { id: 1, name: "Alice",  company: "Acme",    last_contacted: "2024-11-03" },
  { id: 2, name: "John",   company: "Acme",    last_contacted: "2023-05-12" },
  { id: 3, name: "Maria",  company: "ZenCorp", last_contacted: "2024-01-10" },
  { id: 4, name: "Derek",  company: "Beta",    last_contacted: "2022-03-20" },
  { id: 5, name: "Sandra", company: "ZenCorp", last_contacted: "2024-10-21" }
]

def group_and_sort(contacts)
  companies = {}
  # sort companies by contact
  contacts.each do |contact|
    companies[contact[:company]] ||= []
    companies[contact[:company]].push(contact)
  end
  companies.each do |company, list|
    companies[company] = list.sort_by { |c| Date.parse(c[:last_contacted])}.reverse
  end
  companies
end

p group_and_sort(contacts)