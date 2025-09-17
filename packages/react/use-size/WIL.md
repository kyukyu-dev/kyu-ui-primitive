# What I Learn

## offsetWidth, clientWidth, scrollWidth

- offsetWidth: padding, border, scrollbar(브라우저에 따라 포함 X)를 포함하는 width
- clientWidth: border, scrollbar 를 포함하지 않는 width
- scrollWidth: 스크롤 가능 영역까지 포함하는 width

## border box size

- 브라우저에 따라 border box size를 지원 안할 수 있음.
  지원한다면 borderSize의 inlineSize, blockSize를 가져올 수 있는데 offsetWidth와의 차이점은 writing mode(horizontal, vertical)를 고려하는지 안하는지 이다.
  writing mode 를 고려한다면 horizontal일 땐 일반적인 offsetWidth == inlineWidth 이지만 vertical일 땐 offsetHeigth == inlineWidth이다.
