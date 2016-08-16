# Javascript Slider

## support
* ie10 이상에서 지원합니다.
* chrome, firefox 최신 버전

## 사용법
````javascript
var slider = {};
slider = new Slider({ 
	loop : true, 
	duration : .3, 
	paging : true, 
	auto : true, 
	autoDelay : 3000, 
	autoStart : false
});
```
## 옵션
* loop
	* 무한 루프
	* true & fasle
* duration
	* 슬라이드가 움직이는 스피드
	* 0.1, 0.2, 0.3 ....
* paging
	* paging button 사용 여부
	* true & false
* auto
	* 자동 롤링 실행 여부
	* true & false
* autoDelay
	* 자동 롤링 시간 간격
	* 3000, 4000, 5000 ....
* autoStart
	* 페이지 로딩 완료 시 자동 롤링 실행 여부
	* true & fasle




