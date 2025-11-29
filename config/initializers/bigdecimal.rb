require 'bigdecimal'

BigDecimal::DEFAULT_STRING_FORMAT = 'F'

class BigDecimal
  def inspect
    to_s('F')
  end
end
