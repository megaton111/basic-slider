

var Slider = (function(){

	var tag = {}, val = {}, opt = {};
	
	function sliderHandler( option ){

		(function saveElement(){
			tag.wrap = document.getElementById( 'wrapSlider' ),
			tag.wrapSlide = tag.wrap.querySelector( '.container_slide' ),
			tag.itemSlide = tag.wrapSlide.querySelectorAll( '.item_slide' ),
			tag.wrapControl = document.querySelector( '.btn_control_area' ),
			tag.btnMove = tag.wrapControl.querySelectorAll( '[data-tag=move]' ),
			tag.btnPaging, tag.btnAuto, tag.bar, tag.wrapBar;
		})();

		(function saveVal(){
			val.idx = 0,
			val.itemLen = tag.itemSlide.length,
			val.max = val.itemLen,
			val.x = [],
			val.chk = false,
			val.timer, val.wrapWidth, val.wrapHeight, val.itemWidth, val.itemHeight;
		})();

		(function setOption(){
			opt.loop = option.loop == undefined ? true : option.loop,
			opt.paging = option.paging == undefined ? true : option.paging,
			opt.auto = option.auto == undefined ? false : option.auto,
			opt.autoStart = option.autoStart == undefined ? false : option.autoStart,
			opt.duration = option.duration || 0.2,
			opt.autoDelay = option.autoDelay || 3000
		})();

		(function setEvents(){			
			for( var i=0, max=tag.btnMove.length; i<max; i++ ){
				tag.btnMove[i].addEventListener('click', moveBtnClickHandler );	
			}
			tag.wrapSlide.addEventListener('webkitTransitionEnd', movingEndAct );
			tag.wrapSlide.addEventListener('transitionend', movingEndAct );
			window.addEventListener('resize', setLayout );			
		})();

		(function initFunc(){

			tag.itemSlide[0].classList.add( 'active-slide' );
			setLayout();
			setPagingElement();
			setAutoBtnElement()
			if( opt.auto ){ 
				tag.wrapBar = document.createElement( 'div' ),
				tag.wrapBar.classList.add( 'bar_timer' );
				tag.wrapControl.appendChild( tag.wrapBar );
				if( opt.autoStart ){ autoSlide() };
			};

		})();

	};

	function setLayout(){

		val.itemWidth = tag.itemSlide[0].offsetWidth;
		val.itemHeight = tag.itemSlide[0].offsetHeight;
		tag.wrap.style.height = val.itemHeight + 'px';
		tag.wrapSlide.style.transform = 'translateX( -' + val.x[val.idx] + 'px )';
		tag.wrapSlide.style.webkitTransform = 'translateX( -' + val.x[val.idx] + 'px )';
		tag.wrapSlide.style.transition = 'all 0s';
		tag.wrapSlide.style.webkitTransition = 'all 0s';

		for( var i=0; i<val.max; i++ ){
			tag.itemSlide[i].style.left = val.itemWidth * i + 'px';
			val.x[i] = val.itemWidth * i;
		}

	}

	function setPagingElement(){
		
		if( !opt.paging ) return;

		var $wrapPaging = document.createElement('div');
		$wrapPaging.setAttribute('class','btn_paging');

		for( var i=0, max=val.itemLen; i<max; i++ ){
			var btn = document.createElement('button');
			btn.setAttribute('type','button');
			btn.setAttribute('data-tag','paging');
			btn.setAttribute('class','paging');
			btn.textContent = i + 1;
			$wrapPaging.appendChild( btn );
		}

		tag.wrapControl.appendChild( $wrapPaging );
		tag.btnPaging = tag.wrapControl.querySelectorAll( '[data-tag=paging]' );
		tag.btnPaging[0].classList.add( 'active' );

		for( var i=0, max=tag.btnPaging.length; i<max; i++ ){
			tag.btnPaging[i].addEventListener('click', paginBtnClickHandler );
		}

	}

	function setAutoBtnElement() {
		
		if( !opt.auto ) return;

		var $wrapAuto = document.createElement('div'),
			$btnPlay = document.createElement('button'),
			$btnStop = document.createElement('button');

		$wrapAuto.setAttribute('class','btn_auto');
		$btnPlay.setAttribute('class','btn_play');
		$btnPlay.setAttribute('data-type','play');
		$btnPlay.setAttribute('data-tag','auto');
		$btnPlay.textContent = 'play';
		$btnStop.setAttribute('class','btn_stop');
		$btnStop.setAttribute('data-type','stop');
		$btnStop.setAttribute('data-tag','auto');
		$btnStop.textContent = 'stop';

		$wrapAuto.appendChild( $btnPlay );
		$wrapAuto.appendChild( $btnStop );
		tag.wrapControl.appendChild( $wrapAuto );

		tag.btnAuto = tag.wrapControl.querySelectorAll( '[data-tag=auto]' );
		for( var i=0, max=tag.btnAuto.length; i<max; i++ ){
			tag.btnAuto[i].addEventListener('click', function(){
				if( this.getAttribute('data-type') == 'play' ){
					autoSlide();
				}else{
					clearAutoSlide();
				}
			})
		}

	}

	function paginBtnClickHandler(){

		var btn = this;
		
		if( val.chk || btn.classList.contains( 'active' ) ) return;

		[].some.call( tag.btnPaging, function( item, index, array ){
			if( item === btn ) {
				val.idx = index
			};
		});

		clearAutoSlide();
		moving( val.idx );
	};

	function moveBtnClickHandler(){
		
		var dataType = this.getAttribute( 'data-type' ),
			chkLoop = false;

		if( val.chk ) return;

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

		clearAutoSlide();
		moving( val.idx );		
	}

	function moving( idx ){	
		val.chk = true;
		tag.wrapSlide.style.transform = 'translateX( -' + val.x[idx] + 'px )';
		tag.wrapSlide.style.webkitTransform = 'translateX( -' + val.x[idx] + 'px )';
		tag.wrapSlide.style.transition = 'all ' + opt.duration+'s';
		tag.wrapSlide.style.webkitTransition = 'all ' + opt.duration+'s';
		addClassActiveItem( idx );
		addClassActivePaging( idx );	
	}

	function autoSlide(){
		clearInterval( val.timer );
		timerBar();
		val.timer = setInterval(function(){
			val.idx ++;
			if( val.idx >= val.itemLen ) val.idx = 0;
			moving( val.idx );
			timerBar();
		}, opt.autoDelay );
	}

	function clearAutoSlide(){
		if( !opt.auto ) return;
		if( typeof val.timer != undefined ) clearInterval( val.timer );
		tag.wrapBar.innerHTML = '';
	}

	function timerBar(){

		if( !opt.auto ) return;

		tag.wrapBar.innerHTML = '';
		tag.bar = document.createElement( 'span' );
		tag.bar.classList.add( 'bar' );
		tag.bar.classList.add( 'active' );
		tag.bar.style.animationDuration = opt.autoDelay/1000 + 's';
		tag.bar.style.webkitAnimationDuration = opt.autoDelay/1000 + 's';
		tag.wrapBar.appendChild( tag.bar );

	}

	function movingEndAct(){
		val.chk = false;
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
		
		if( !opt.paging ) return;

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



