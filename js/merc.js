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
				method: 'POST',
				url: 'https://script.google.com/macros/s/AKfycbw4g-qjr-XVu1ehIm1qevyAzrc6x1vQaIkVAqW3/exec',
				params: {
					'method': 'query'
				}
			}).then(function(response) {
				var units = response.data.units;
				for (var i=1; i < units.length; i++){
					var unit = {};
					unit.id = units[i][0];//ID
					unit.picURL = units[i][1];//画像
					unit.name = units[i][2];//ユニット名
					unit.country = units[i][3];//出身
					//unit.age = units[i][4];//年齢
					//unit.sex = units[i][5];//性別
					unit.rare = units[i][6];//レアリティ
					unit.attribute = units[i][7];//属性
					unit.grownType = units[i][8];//成長タイプ
					unit.weapon = units[i][9];//武器
					unit.weaponType = units[i][10];//武器種別
					unit.atkNum = parseInt(units[i][11]);//同時攻撃数
					unit.atkSegment = parseInt(units[i][12]);//攻撃段数
					unit.initHP = parseInt(units[i][13]);//初期体力
					unit.maxHP = parseInt(units[i][14]);//最大体力
					unit.awakeHP = parseInt(units[i][15]);//覚醒体力
					unit.speed = parseInt(units[i][16]);//移動速度
					unit.distance = parseInt(units[i][17]);//リーチ
					//unit.initDPS = parseInt(units[i][18]);//DPS
					unit.awakeDPS = parseInt(units[i][19]);//覚醒DPS
					unit.initATK = parseInt(units[i][20]);//初期攻撃力
					unit.maxATK = parseInt(units[i][21]);//最大攻撃力
					unit.awakeATK = parseInt(units[i][22]);//覚醒攻撃力
					unit.period = parseFloat(units[i][23]);//攻撃間隔
					unit.toughness = parseInt(units[i][24]);//タフネス
					//unit.totalDPS = parseInt(units[i][25]);//総合DPS
					unit.awakeTotalDPS = parseInt(units[i][26]);//覚醒総合DPS
					$scope.unitList.push(unit);
				}
				$scope.lastupdate = new Date(response.data.lastupdate);
			}).catch(function(response) {
				console.error('error', response.status, response.data);
			}).finally(function() {
				var data = $scope.unitList;
				$scope.tableParams = new NgTableParams({count: data.length, sorting: { awakeDPS: "desc" }}, {counts: [], dataset: data});
				//count:每頁筆數、counts: [5, 10, 15]，放空不顯示分頁;
			})
		}
		
		$scope.update = function (name){
			$scope.updateFlag = true;
			$http({
				method: 'POST',
				url: 'https://script.google.com/macros/s/AKfycbw4g-qjr-XVu1ehIm1qevyAzrc6x1vQaIkVAqW3/exec',
				params: {
					'method': 'update',
					'unitName': name
				}
			}).then(function(response) {
				console.log(response.data);
				if (response.data.status == 'fail'){
					alert(response.data.message);
				}
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