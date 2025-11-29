# class BankAccount
#   attr_reader :balance
#   def initialize(starting_balance=0)
#     @balance = starting_balance
#   end
#
#   def withdrawal(amount)
#     if amount > @balance
#       return false
#     end
#     @balance -= amount
#     true
#   end
#
#   def deposit(amount)
#     @balance += amount
#   end
#
#   def check_balance
#     @balance
#   end
#
# end
#
# account = BankAccount.new
# account.deposit(1000)
# account.withdrawal(300)
# puts account.balance

def word_count(input)
  input.split(/\s+/).count
end

p word_count('Hello World I am ready for cake s    sss    sss')