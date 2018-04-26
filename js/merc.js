'use strict';
app.controller('merc',
	function($scope, $filter, $http, $window, NgTableParams) {
		$scope.init = function (){
			$scope.updateFlag = false;
			$scope.rareList = ["★1", "★2", "★3", "★4", "★5"];
			$scope.attributeList = ["炎", "水", "風", "光", "闇"];
			$scope.weaponList = ["斬撃", "突撃", "打撃", "弓矢", "魔法", "銃弾", "回復"];
			$scope.searchVO = {
				rare : [],
				attribute : [],
				weaponType : [],
				distanceMin : undefined,
				distanceMax : undefined,
				atkNumMin : undefined,
				atkNumMax : undefined,
				atkSegMin : undefined,
				atkSegMax : undefined
			}
			$scope.unitList = [];
			$scope.iframeHeight = $window.innerHeight - 90;
			
			$http({
				method: 'GET',
				url: 'https://spreadsheets.google.com/feeds/cells/1dF8a4LU9JbPXAP5FrDcWa1SJoy6hRoiQXFI_ASGtEY0/1/public/values?alt=json',
			}).then(function(response) {
				var feed = response.data.feed;
				for (var i=27; i <feed.entry.length; i+=27){//feed.entry.length
					var unit = {};
					unit.id = feed.entry[i].content.$t;//ID
					unit.picURL = feed.entry[i+1].content.$t;//画像
					unit.name = feed.entry[i+2].content.$t.replace('」', '」<br>');//ユニット名
					unit.country = feed.entry[i+3].content.$t;//出身
					//unit.age = feed.entry[i+4].content.$t;//年齢
					//unit.sex = feed.entry[i+5].content.$t;//性別
					unit.rare = feed.entry[i+6].content.$t;//レアリティ
					unit.attribute = feed.entry[i+7].content.$t;//属性
					unit.grownType = feed.entry[i+8].content.$t;//成長タイプ
					unit.weapon = feed.entry[i+9].content.$t;//武器
					unit.weaponType = feed.entry[i+10].content.$t;//武器種別
					unit.atkNum = feed.entry[i+11].content.$t;//同時攻撃数
					unit.atkSegment = feed.entry[i+12].content.$t;//攻撃段数
					unit.initHP = feed.entry[i+13].content.$t;//初期体力
					unit.maxHP = feed.entry[i+14].content.$t;//最大体力
					unit.awakeHP = feed.entry[i+15].content.$t;//覚醒体力
					unit.speed = feed.entry[i+16].content.$t;//移動速度
					unit.distance = feed.entry[i+17].content.$t;//リーチ
					//unit.initDPS = feed.entry[i+18].content.$t;//DPS
					unit.awakeDPS = feed.entry[i+19].content.$t;//覚醒DPS
					unit.initATK = feed.entry[i+20].content.$t;//初期攻撃力
					unit.maxATK = feed.entry[i+21].content.$t;//最大攻撃力
					unit.awakeATK = feed.entry[i+22].content.$t;//覚醒攻撃力
					unit.period = feed.entry[i+23].content.$t;//攻撃間隔
					unit.toughness = feed.entry[i+24].content.$t;//タフネス
					//unit.totalDPS = feed.entry[i+25].content.$t;//総合DPS
					unit.awakeTotalDPS = feed.entry[i+26].content.$t;//覚醒総合DPS
					$scope.unitList.push(unit);
				}
			}).catch(function(response) {
				console.error('error', response.status, response.data);
			}).finally(function() {
				var data = $scope.unitList;
				$scope.tableParams = new NgTableParams({count: data.length, sorting: { awakeDPS: "desc" }}, {counts: [], dataset: data});
				//count:每頁筆數、counts: [5, 10, 15]，放空不顯示分頁;
			})
		}
		
		$scope.update = function (){
			$scope.updateFlag = true;
			$http({
				method: 'POST',
				url: 'https://script.google.com/macros/s/AKfycbw4g-qjr-XVu1ehIm1qevyAzrc6x1vQaIkVAqW3/exec',
				params: {
					'method': 'update'
				}
			}).then(function(response) {
				console.log(data);
			}).catch(function(response) {
				console.error('error', response.status, response.data);
			}).finally(function() {
				$scope.updateFlag = false;
				$window.location.reload();
			});			
		}
		
		$scope.topFunction = function (){
			document.querySelector('#tablebody').scrollTop = 0;
		}
		
		$scope.init();
    }
);

//<tr ng-repeat="unit in $data | searchFilter : searchVO">
app.filter('searchFilter',function(){
	return function(units, searchVO) {
		var result = [];
		for (var index in units){
			var unit = units[index];
			//稀有
			if (searchVO.rare.length > 0 && searchVO.rare.indexOf(unit.rare) == -1){
				continue;
			}
			//屬性
			if (searchVO.attribute.length > 0 && searchVO.attribute.indexOf(unit.attribute) == -1){
				continue;
			}
			//種別
			if (searchVO.weaponType.length > 0 && searchVO.weaponType.indexOf(unit.weaponType) == -1){
				continue;
			}
			//距離
			if (searchVO.distanceMin && searchVO.distanceMin > unit.distance){
				continue;
			}
			if (searchVO.distanceMax && searchVO.distanceMax < unit.distance){
				continue;
			}
			//同時攻撃数
			if (searchVO.atkNumMin && searchVO.atkNumMin > unit.atkNum){
				continue;
			}
			if (searchVO.atkNumMax && searchVO.atkNumMax < unit.atkNum){
				continue;
			}
			//攻撃段数
			if (searchVO.atkSegMin && searchVO.atkSegMin > unit.atkSegment){
				continue;
			}
			if (searchVO.atkSegMax && searchVO.atkSegMax < unit.atkSegment){
				continue;
			}
			result.push(unit);
		}
		return result;
    }
});	