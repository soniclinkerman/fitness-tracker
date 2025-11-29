class Shape
  def area
    raise NotImplementedError, 'Subclass must pass formula'
  end
end

class Rectangle < Shape

  def initialize(length,width)
    @length=length
    @width=width
  end
  def area
    @length*@width
  end
end

rectangle = Rectangle.new(2,3)
p rectangle.area