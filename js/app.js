/*

  jQuery UI CoverFlow II
  Copyright Addy Osmani 2010.
*/

	$(function() {
	

		//Кэшируем ключевые компоненты
		var html = $('#demo-frame div.wrapper').html();
		var imageCaption = $('#imageCaption');
		$('#demo-frame div.wrapper').parent().append(html).end().remove();
		$sliderCtrl = $('#slider');
		$coverflowCtrl = $('#coverflow');
		$coverflowImages = $coverflowCtrl.find('img');
		$sliderVertical  = $("#slider-vertical");
		
	    //Значения по умолчанию
        var defaultItem  = 0;
		var listContent = "";
		
			   
       //Устанавливаем индекс изображения по умолчанию
	   setDefault(7);
	

       //Устанавливаем пункт, который будет выводиться при загрузке
       //Корректируем индекс
	   function setDefault($n){
	      defaultItem = $n-1;  
	   }
	   
	   //Устанавливаем подись изображения
	   function setCaption($t){
	     imageCaption.html($t);
	   }

		
		//Инициализируем CoverFlow
		$coverflowCtrl.coverflow({
		    item: defaultItem,
		    duration:1200,
			select: function(event, sky) 
			{
			skipTo(sky.value);

			}
		});
			

       //Инициализируем горизонтальный слайдер
		$sliderCtrl.slider({
			min: 0,
			max: $('#coverflow > *').length-1,
			value: defaultItem,
			slide: function(event, ui) {
				$coverflowCtrl.coverflow('select', ui.value, true);
				$('.coverflowItem').removeClass('ui-selected');
                $('.coverflowItem:eq(' + (ui.value) +')').addClass('ui-selected');
                setCaption($('.coverflowItem:eq(' + (ui.value) +')').html());

			}
		});
		
			
	   //CoverFlow проводим до нужного пункта
	   function skipTo($itemNumber)
       {  
          $sliderCtrl.slider( "option", "value", $itemNumber);
          $coverflowCtrl.coverflow('select', $itemNumber, true);
          $('.coverflowItem').removeClass('ui-selected');
          $('.coverflowItem:eq(' + ($itemNumber) +')').addClass('ui-selected');
          setCaption($('.coverflowItem:eq(' + ($itemNumber) +')').html());

       }



		//Генерируем текстовый список под изображениями обложек
		$coverflowImages.each(function(index, value)
		{
		   $artist = $(this).data('artist');
		   $album = $(this).data('album');
		   
		   try{
		      listContent += "<li class='ui-state-default coverflowItem' data-itemlink='" 
		                   + (index) +"'>" + $artist + " - " + $album +"</li>";
		   }catch(e){ 
		   }
		});
		
		
		//Устанавливаем все органы управления на текущий элемент
		$('#sortable').html(listContent);
		skipTo(defaultItem);
		
		//Назначаем обработку события click для изображений обложек  
		$('body').delegate('.coverflowItem','click', function(){
		   skipTo($(this).data('itemlink'));
		});
		
		
		
		//Обрабатываем события клавиатуры
		$(document).keydown(function(e){
		
		  $current = $sliderCtrl.slider('value');
		  
		   switch(e.keyCode){   
		     case 37:
		     if($current > 0){ 
		       $current--;
		       skipTo($current);
		     }
		     break;
		     
		     case 39: 
		     if($current < $('#coverflow > *').length-1){ 
		       $current++;
		       skipTo($current);
		      }	     
		     break;
		   }
		   
		});
		
		
		
		

	//Устанавливаем для основного элемента div значение overflow: hidden, так как мы будем использовать слайдер
	$("#scroll-pane").css('overflow','hidden');
	
	//Вычисляем высоту, которую должна обрабатывать панель прокрутки
	var difference = $("#sortable").height()-$("#scroll-pane").height();// Например, на 200px длинее
	var proportion = difference / $("#sortable").height();// Например, 200px/500px
	var handleHeight = Math.round((1-proportion)*$("#scroll-pane").height());// Устанавливаем пропорциональную высоту



	//Устанавливаем слайдер
	$sliderVertical.slider({
		orientation: "vertical",
		range: "max",
		min: 0,
		max: 100,
		value: 0 ,
		slide: function(event, ui) 
		{
			
			var topValue = -((100-ui.value)*difference/100);
			$("#sortable").css({top:topValue});//Перемещаем значение top вверх (отрицательное значение) на величину умножения процентного смещения слайдера и разницы высот
		}
	});

	
	var origSliderHeight = $sliderVertical.height();//Получаем оригинальное значение высоты слайдера
	var sliderHeight = origSliderHeight - handleHeight ;//Высота, на которую наждо передвинуть, должна быть разницой между оригинальным и вычисленным значением
	var sliderMargin =  (origSliderHeight - sliderHeight)*0.5;// Для слайдера нужно верхние и нижнее поле установить равными половине разницы
	
	
	/* Запускаем прокрутчик для вывода текущего изображения на экран. */
	/* Данный пункт можно закоментировать, если он не нужен */
	function setScrollPositions(item){
	
	var q =  item * 5;
	var qx = -35;

	$sliderVertical.slider('value', q);
	$('#sortable').css('top', -q + qx);
	

	}
	

	setScrollPositions(defaultItem);

	
	
//Поддержка колесика мыши
	
	$(document).mousewheel(function(event, delta){
	
  		var speed = 1;
	    var sliderVal = $sliderCtrl.slider("value");//Получаем текущее значение слайдера
		var coverflowItem = 0;
		var cflowlength = $('#coverflow > *').length-1;

       
       //Проверяем delta для определения направления прокрутки колесика мыши
       if(delta > 0 && sliderVal > 0){
           sliderVal -=1;
       }else{
          if(delta < 0 && sliderVal < cflowlength){
           sliderVal +=1;
          }
          
       }
     
		var leftValue = -((100-sliderVal)*difference/100);// Вычисляем положение верхя содержания из положения слайдера
		
		if (leftValue>0) leftValue = 0;// Останавливаем чрезмерную прокурутку вниз
		if (Math.abs(leftValue)>difference) leftValue = (-1)*difference;// останавливаем прокрутку содержания за нужную точку
		
		coverflowItem = Math.floor(sliderVal);
		skipTo(coverflowItem);
	
	    event.preventDefault();//Останавливаем обработку события по умолчанию
 	});
	

		
	

		
});

