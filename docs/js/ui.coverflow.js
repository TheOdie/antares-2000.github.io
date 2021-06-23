/*
 * jQuery UI CoverFlow
   Изменен для jQueryUI 1.8.6/jQuery 1.4.4 Addy Osmani.
   Оригинал: Paul Bakaus для jQueryUI 1.7 
 */
(function($){



	var browserVersion = $.browser.version.replace(/^(\d+\.)(.*)$/, function() { return arguments[1] + arguments[2].replace(/\./g, ''); });
	var supportsTransforms = !($.browser.mozilla && (parseFloat(browserVersion) <= 1.9)) && !$.browser.opera;
	
	$.easing.easeOutQuint = function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	};

	$.widget("ui.coverflow", {
	
	   options: {
	   
	        items: "> *",
			orientation: 'horizontal',
			item: 0,
			trigger: 'click',
			center: true, // Центрирование 
			recenter: true //Если значение false, то позиционирование родительского элемента не анимируется, пока изменяется положение потомка
			
	  },
		
		_create: function() {
			
			var self = this, o = this.options;
			this.items = $(o.items, this.element);
			this.props = o.orientation == 'vertical' ? ['height', 'Height', 'top', 'Top'] : ['width', 'Width', 'left', 'Left'];
			//Для jQuery < 1.8.2: this.items['outer'+this.props[1]](1);
			
			this.itemSize = 0.73 * this.items.innerWidth();
			this.itemWidth = this.items.width();
			this.itemHeight = this.items.height();
			this.duration = o.duration;
			this.current = o.item; // Начальный пункт
			

			//Привязываем обрадотчик события click к пунктам
			this.items.bind(o.trigger, function() {
				self.select(this);
				
			});


			//Центрируем левую стророну родительского элемента

			this.element.css(this.props[2],
				(o.recenter ? -this.current * this.itemSize/2 : 0)
				+ (o.center ? this.element.parent()[0]['offset'+this.props[1]]/2 - this.itemSize/2 : 0) //Центрируем контейнер пунктов
				- (o.center ? parseInt(this.element.css('padding'+this.props[3]),10) || 0 : 0) //Вычитаем отступ контейнера пунктов
			);

			//Переходим к первому пункту
			this._refresh(1, 0, this.current);

		},
		
		select: function(item, noPropagation) {
		
			
			this.previous = this.current;
			this.current = !isNaN(parseInt(item,10)) ? parseInt(item,10) : this.items.index(item);
			
		
			
			
			//Не анимировать, если нажатие произошло на том же пункте
			if(this.previous == this.current) return false; 
			
			//Изменяем $.fx.step.coverflow каждый раз снова на пользовательские значения для определенной анимации
			var self = this, to = Math.abs(self.previous-self.current) <=1 ? self.previous : self.current+(self.previous < self.current ? -1 : 1);
			$.fx.step.coverflow = function(fx) { self._refresh(fx.now, to, self.current); };
			
			// 1. Останавливаем предыдущую анимацию
			// 2. Анимируем изменение свойств left/top родителя для центрирования текущего пункта
			// 3. Используем пользовательсткую анимацию для пункта
			
				
		
			var animation = { coverflow: 1 };
		
		
			animation[this.props[2]] = (
				(this.options.recenter ? -this.current * this.itemSize/2 : 0)
				+ (this.options.center ? this.element.parent()[0]['offset'+this.props[1]]/2 - this.itemSize/2 : 0) //Центрируем контейнер пунктов
				- (this.options.center ? parseInt(this.element.css('padding'+this.props[3]),10) || 0 : 0) //Вычитаем отступ контейнера пунктов
			);
		
		
			
			//Запускаем событие 'select'
			if(!noPropagation) this._trigger('select', null, this._uiHash());
			
			this.element.stop().animate(animation, {
				duration: this.options.duration,
				easing: 'easeOutQuint'
			});
			
		},
		
		_refresh: function(state,from,to) {
		
	
			var self = this, offset = null;
	
			
			this.items.each(function(i) 
			{
			
				
				var side = (i == to && from-to < 0 ) ||  i-to > 0 ? 'left' : 'right',
					mod = i == to ? (1-state) : ( i == from ? state : 1 ),
					before = (i > from && i != to),
					css = { zIndex: self.items.length + (side == "left" ? to-i : i-to) };
					
				
		            css[($.browser.safari ? 'webkit' : 'Moz')+'Transform'] = 'matrix(1,'+(mod * (side == 'right' ? -0.2 : 0.2))+',0,1,0,0) scale('+(1+((1-mod)*0.3)) + ')';
				
		            css[self.props[2]] = ( (-i * (self.itemSize/2)) + (side == 'right'? -self.itemSize/2 : self.itemSize/2) * mod );
				
			
				if(!supportsTransforms) {
					css.width = self.itemWidth * (1+((1-mod)*0.5));
					css.height = css.width * (self.itemHeight / self.itemWidth);
					css.top = -((css.height - self.itemHeight) / 2);
				}
	
				
				$(this).css(css);


			});

			this.element.parent().scrollTop(0);
			
		},
		
		_uiHash: function() {
			return {
				item: this.items[this.current],
				value: this.current
			};
		}
		
	});

	
})(jQuery); 