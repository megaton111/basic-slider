

var Slider = (function(){

	var tag = {}, val = {}, opt = {};
	
	function sliderHandler( option ){

		(function saveElement(){
			tag.wrap = document.getElementById( 'wrapSlider' ),
			tag.wrapSlide = tag.wrap.querySelector( '.container_slide' ),
			tag.itemSlide = tag.wrapSlide.querySelectorAll( '.item_slide' ),
			tag.wrapControl = document.querySelector( '.btn_control_area' ),
			tag.btnPaging = tag.wrapControl.querySelectorAll( '[data-tag=paging]' ),
			tag.btnMove = tag.wrapControl.querySelectorAll( '[data-tag=move]' );
		})();

		(function saveVal(){
			val.idx = 0,
			val.itemLen = tag.itemSlide.length,
			val.max = val.itemLen,
			val.x = [],
			val.wrapWidth, val.wrapHeight, val.itemWidth, val.itemHeight;
		})();

		(function setOption(){
			opt.loop = option.loop || false
		})();

		(function setEvents(){
			for( var i=0, max=tag.btnPaging.length; i<max; i++ ){
				tag.btnPaging[i].addEventListener('click', paginBtnClickHandler );
			}
			for( var i=0, max=tag.btnMove.length; i<max; i++ ){
				tag.btnMove[i].addEventListener('click', moveBtnClickHandler );	
			}
			window.addEventListener('resize', setLayout );
		})();

		(function initFunc(){
			tag.itemSlide[0].classList.add( 'active-slide' );
			setLayout();
			console.log( opt );
		})();


	};

	function setLayout(){
	
		val.itemWidth = tag.itemSlide[0].offsetWidth;
		val.itemHeight = tag.itemSlide[0].offsetHeight;
		tag.wrap.style.height = val.itemHeight + 'px';
		tag.wrapSlide.style.transform = 'translateX( -' + val.x[val.idx] + 'px )';
		tag.wrapSlide.style.webkitTransform = 'translateX( -' + val.x[val.idx] + 'px )';
		tag.wrapSlide.style.Transition = 'all 0s';
		tag.wrapSlide.style.webkitTransition = 'all 0s';

		for( var i=0; i<val.max; i++ ){
			tag.itemSlide[i].style.left = val.itemWidth * i + 'px';
			val.x[i] = val.itemWidth * i;
		}
		

	}

	function paginBtnClickHandler(){
		var btn = this;
		[].some.call( tag.btnPaging, function( item, index, array ){
			if( item === btn ) {
				val.idx = index
			};
		});
		console.log( val.idx );
		moving( val.idx );
	};

	function moveBtnClickHandler(){
		
		var dataType = this.getAttribute( 'data-type' ),
			chkLoop = false;

		if( !opt.loop ){			
			if( val.idx == val.itemLen - 1 && dataType == 'next' ) chkLoop = true;
			if( val.idx === 0 && dataType == 'prev' ) chkLoop = true;
		}

		if( chkLoop ) return;
		
		if( dataType === 'next' ){
			val.idx ++ ;
			if( val.idx >= val.itemLen ) val.idx = 0;
		}else{
			val.idx --;
			if( val.idx < 0 ) val.idx = val.itemLen - 1; 
		}
		moving( val.idx );		
	}

	function moving( idx ){
		tag.wrapSlide.style.transform = 'translateX( -' + val.x[idx] + 'px )';
		tag.wrapSlide.style.transform = 'translateX( -' + val.x[idx] + 'px )';
		tag.wrapSlide.style.Transition = 'all .3s';
		tag.wrapSlide.style.webkitTransition = 'all .3s';		
		addClassActiveItem( idx );
		addClassActivePaging( idx );
	}

	function addClassActiveItem( idx ){
		for( var i=0, max=val.itemLen; i<max; i++ ){			
			if( i == idx ) {
				tag.itemSlide[i].classList.add( 'active-slide' );
			}else{
				tag.itemSlide[i].classList.remove( 'active-slide' );
			}
		}
	}

	function addClassActivePaging( idx ){
		for( var i=0, max=val.itemLen; i<max; i++ ){			
			if( i == idx ) {
				tag.btnPaging[i].classList.add( 'active' );
			}else{
				tag.btnPaging[i].classList.remove( 'active' );
			}
		}	
	}


	return sliderHandler;

})();



