"use strict";
$(function() {
	//创建各种事件
	var hasTouch = 'ontouchstart' in window,
		//鼠标事件or触摸事件
		TAP_EV = hasTouch ? 'tap' : 'tap',
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup';
	//游戏开始的时候定义的全局变量
	var startMsg;
	var  start_number=0;
	var isFist = true;
	var game = {
		//当前桥
		currentBridge: null,
		myInterval: null,
		role: $('.role'),
		bridge: $('.bridge'),
		lineHeight: null,
		currentLevel: 0, //当前关卡
		soundStatus: false,
		bgInterval: null,
		intervalTime: 5000,
		//初始化
		init: function() {
			//加载完成
			//黑色背景加载
			$('.loading').animate({
				opacity: 0
			}, 600, '', function() {
				//隐藏				
				$(this).hide();
			})
			//主页显示
			$('.main').show();
			this.addEvent();
			//this.reset();

			//this.gameStart();
			//localStorage.removeItem('bestLevel');
			//
			/*添加音乐文件*/
			function addSoundHtml() {}
		},
		//添加事件
		addEvent: function() {
			var _this = this;
			var isClick = false;
			document.addEventListener(START_EV, banTouchScroll, false);
			var isRule = false;

			function banTouchScroll(event) {
				if(!isRule) {
					event.preventDefault();
				} else {

				}

			};
			$('img').on(START_EV, banTouchScroll);

			//排行榜点击
			$('.viewBtn').on(START_EV, function() {
				window.location.href = 'my_ranking.html'
			})
			
			//游戏开始按钮
			//封面开始页面找到开始游戏的按钮 点击触发
			$('.infoPage').find('.gameStartBtn').on(START_EV, function() {
				start_number++;
//				console.log(start_number)
				//进入页面后，按钮出现
				/*$('.btnIco').show()
				$('.index_music').hide()
				$('.index_rule').hide()*/
				isFist = true;
				_this.startGame(function(data) {
					if(data.normal) {
						startMsg = "OK";
						$("#code").val(data.code);
					} else {
						startMsg = data.msg;
						if(data.msg == "EndTask") {
							_this.msgShow('本活动已经结束，谢谢参与！');
							return;
						} else if(data.msg == "LimitOf") {
							_this.msgShow('每天最多可以参加3次，欢迎明天继续参加..');
						} else if(data.msg == 'NoActivity') {
							_this.msgShow('没有此活动')
						} else if(data.msg = 'NoOpenTask') {
							_this.msgShow('活动还没开始')
						}
					}
				});
				if(startMsg != "OK") {
					return;
				}
				//如果是pc点击事件 return 
				if(isClick) return;
				//$('.infoPage').fadeOut()
				/*$('.infoPage').animate({opacity:0}, 400, '', function(){
					
				})*/
				//封面淡出
				$('.infoPage').fadeOut(400, function() {
					_this.addDrawLineEvent();
					//封面隐藏 进入游戏了
					$('.infoPage').hide();
					isClick = false;
				})

				_this.clearBgInterval();
				_this.enterPage();
				_this.createBridge();
				isClick = true;
			})
			//ico点击事件【我的，规则，音乐】
			$('.btnIco').on(END_EV, function() {
				var $self = $(this);
				//我的
				if($self.hasClass('myBtn')) {

					var $scoreTxt = $('.packPanel').find('.scoreTxt');
					//背包
					_this.getServerLevelData(function(data) {
						//								$scoreTxt.html('<div><b>中奖内容</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>中奖时间</b></div></div>');
						$scoreTxt.html('<div><b>中奖内容</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>中奖时间</b></div></div>');
						$scoreTxt.addClass('active_mo')
						//
						console.log("postGameLevel:" + data.msg)

						if(data.normal) {
							$('.packPanel').show();
							var msg = eval('(' + data.msg + ')')
							$.each(msg.cards, function(index, obj) {
								console.log(index)
								console.log(obj)
								//											var html = '<div><b>中奖内容</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>中奖时间</b></div><div><span>100M流量</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>2117.12.12</span></div>';'
								var html = '<div><span>' + obj.cardName + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>' + obj.msg + '</span></div>';
								$('.scoreTxt').append(html)
							})
						} else {
							if(data.msg == "NoActivity") {
								_this.msgShow('没有此活动！');
							} else if(data.msg == "NoOpenTask") {
								_this.msgShow('任务还没开启!');
							} else if(data.msg == "LimitOf") {
								_this.msgShow('每天最多可以参加3次，欢迎明天继续参加..');
							}
						}

					})
					$('.myPanel').one(END_EV, function() {
						$(this).hide();
					})
				}
				//规则
				else if($self.hasClass('ruleBtn')) {
					//					$('.rulePanel').show();
					window.location.href = 'ruleImg.html'
					$('.rulePanel').find('.closeBtn').one(END_EV, function() {
						$('.rulePanel').hide();
						isRule = false;
					})
					isRule = true;
				} else if($self.hasClass('musicBtn')) {
					_this.msgShow('音乐');
					$('.close_musicBtn').toggle()
				}
				else if($self.hasClass('index_rule')) {
					window.location.href = 'ruleImg.html'
					$('.rulePanel').find('.closeBtn').one(END_EV, function() {
						$('.rulePanel').hide();
						isRule = false;
					})
					isRule = true;
				} else if($self.hasClass('index_music')) {
					_this.msgShow('音乐');
					$('.close_showBtn').toggle()
				}
			})

		},

		//进入页面
		enterPage: function() {
			var _this = this,
				$role = this.role,
				$bridge = this.bridge;
			this.setCss3($bridge, 'translate(0px,100%)');
			this.setCss3($role, 'translate(-50px,0)');
			window.setTimeout(function() {
				_this.setCss3($bridge, 'translate(0,0)', 'all 0.5s');
				window.setTimeout(function() {
					$role.addClass('roleRunAm')
					$role.attr('data-currentx', 70);
					_this.setCss3($role, 'translate(70px,0)', 'all .6s linear');
					setTimeout(function() {
						$role.removeClass('roleRunAm');
					}, 600)
				}, 500)
			}, 600)
			$('.game,.gameBg').show();
			this.bgAutoPlay();
		},
		//添加画线事件
		addDrawLineEvent: function() {
			var _this = this;
			$('.hit').one(START_EV, function() {
				_this.drawLineStart();
				$(this).one(END_EV, function() {
					_this.drawLineStop(function() {
						_this.advance();
					});
				})
			})
		},
		/**
		 * 下一关
		 */
		nextLevel: function() {
			var _this = this;
			this.createBridge();
			this.addDrawLineEvent();
			//当前关卡数递增
			this.currentLevel++;
			//保存最佳通关记录
			this.saveLevelLog();

			//走完第一关弹出
			if(this.currentLevel == 3) {
				$('.successPanel').show();
				//返回
				//第三关弹出框上的按钮
				$('.successPanel').find('.backBtn').on(END_EV, function() {
					if(!isFist) {
						return;
					}
					isFist = false;
					_this.eggGame(function(data) {
						console.log("eggGame:" + data.msg)
						if(data.normal) {
							_this.track_egg();
							window.setTimeout(function() {
								$('.success_text').html('恭喜你砸中了' + data.msg + '流量')
							}, 2000)
						} else {
							$('.successBox').hide()
							startMsg = data.msg;
							if(data.msg == "EndTask") {
								_this.msgShow('本活动已经结束，谢谢参与！');
								return;
							} else if(data.msg == "LimitOf") {
								_this.msgShow('每天最多可以参加3次，欢迎明天继续参加..');
							} else if(data.msg == 'NoActivity') {
								_this.msgShow('没有此活动')
							} else if(data.msg = 'NoOpenTask') {
								_this.msgShow('活动还没开始')
							}
						}

					});
				})
				$('.successPanel').find('.continueBtn').on(END_EV, function() {
					$('.successPanel').hide();
				})
			}





			//如果等于第八关
			if(this.currentLevel == 1) {
				//记录分数
				_this.postGameLevel();
				$('.failPanel').show();
				$('.failPanel').find('.backBtn').one(END_EV, function() {
					$('.failPanel').hide();
					_this.again();
				})
//				$('.failPanel').find('.failTxt').find('img').hide();
				if(start_number>=2){
					$('.failPanel').find('.failTxt').find('img').eq(2).hide();
					$('.failPanel').find('.failTxt').find('img').eq(3).show();
				}else{
					$('.failPanel').find('.failTxt').find('img').eq(3).hide();
					$('.failPanel').find('.failTxt').find('img').eq(2).show();					
				}
			}
		},
		
		
		
		
		
		
		
		/**
		 * 通关记录
		 */
		saveLevelLog: function() {
			var bestLevel = localStorage.getItem('bestLevel');
			var levelNum = localStorage.getItem('levelNum');
			var currentLevel = this.currentLevel;
			if(bestLevel) {
				//保存最佳记录
				if(bestLevel < currentLevel) localStorage.setItem('bestLevel', currentLevel);
				//localStorage.setItem('levelNum', levelNum++);
			} else {
				localStorage.setItem('bestLevel', 1);
				//localStorage.setItem('levelNum', 1);
			}
			console.log('bestLevel:', localStorage.getItem('bestLevel'));
		},

		//获取最佳记录
		getBestLevel: function() {
			var bestLevel = localStorage.getItem('bestLevel');
			return bestLevel ? bestLevel : false;
		},

		setLevelNum: function() {
			var levelNum = localStorage.getItem('levelNum');
			if(levelNum) {
				localStorage.setItem('levelNum', Number(levelNum) ++);
			} else {
				localStorage.setItem('levelNum', 1);
			}
		},

		//获取闯关次数
		getLevelNum: function() {
			var levelNum = localStorage.getItem('levelNum');
			return levelNum ? levelNum : 0;
		},

		/**
		 * 前进
		 */
		advance: function() {
			var _this = this,
				$role = this.role,
				$bridge = this.bridge,
				$currentBridge = this.currentBridge,
				roleCurrentX = Number($role.attr('data-currentx')),
				cx = parseInt($currentBridge.css('left'));
			cx = cx ? cx : 0;
			var $last = $bridge.find('li').last();
			var lastX = Number($last.attr('data-currentx'));
			//线条高度
			var lineH = this.lineHeight;
			var lastW = Number($last.width());
			var cw = Number($currentBridge.width());
			var spaceBetween = lastX - cx - cw;
			//是否过桥了
			var isPass = (lineH >= spaceBetween && lineH <= spaceBetween + lastW) ? true : false;
			//当前的距离
			var cDistance = lineH + roleCurrentX;
			//最终距离 
			var finalDistance = cx + (lastX - cx) + lastW - 50;
			//最后采用的距离是
			var distance = isPass ? finalDistance : cDistance + 30;
			//运动持续时间
			var dur = (distance - cx) / 500;
			this.setCss3($role, 'translate(' + distance + 'px,0)', 'all ' + dur + 's linear');
			//给老子走起来
			$role.addClass('roleRunAm');
			window.setTimeout(function() {
				$role.removeClass('roleRunAm');
				//如果过桥了
				if(isPass) {
					//下一关
					_this.nextLevel();
					$role.attr('data-currentx', distance);
					_this.setCss3($('.game'), 'translate(' + -(distance - lastW + 30) + 'px, 0)', 'all 0.5s ease');
				} else {
					//游戏失败
					_this.gameOver();
					//游戏失败弹窗

					//设置游戏进程
					_this.setTransition($role, 'all 0.2s linear');
					$role.css('top', $('.game').height());
					_this.setCss3($currentBridge.find('.line span'), 'rotate(180deg)', 'all 0.5s');
				};
				//_this.setCss3($('.game'), 'translate(-200px, 0)', 'all 0.5s ease')
			}, dur * 1000);
			console.log('isPass:::', isPass);
		},

		/**
		 * 是否还可以继续
		 */
		isContinue: function() {

		},

		//生成桥
		createBridge: function() {
			var _this = this,
				$role = this.role,
				$bridge = this.bridge,
				stageW = 640, //舞台宽
				fixW = 40; //固定宽
			var ranW = fixW + Math.round(Math.random() * 70);
			//获取最后一个元素
			var $lastEl = $bridge.find('li').last();
			//保存角色所站在的桥
			this.currentBridge = $lastEl;
			//最后一个元素的宽
			var lastW = $lastEl.width();

			//var lX = $lastEl.css('left');
			//随机坐标
			var ranX = Math.round((stageW - lastW - fixW - ranW - 30) * Math.random()) + (fixW + lastW) + Number($lastEl.attr('data-currentx'));
			var html = '<li class="animated slideInUp" data-currentx="' + ranX + '" style="width:' + ranW + 'px; left:' + ranX + 'px;"><div class="line"><span></span></div></li>';
			$bridge.find('ul').append(html);
		},

		bgAutoPlay: function() {
			var _this = this;
			var num = Math.ceil(3 * Math.random());
			$('.gameBg').find('.bg1,.bg2,.bg3').hide();
			var $preBg = $('.gameBg').find('.bg' + num);
			//$preBg.css('zIndex',10);
			$preBg.show();

			this.bgInterval = window.setInterval(function() {
				if(!_this.bgInterval) {
					window.clearInterval(_this.bgInterval);
					return;
				}
				num++;
				if(num > 3) num = 1;
				$preBg.fadeOut();
				$preBg = $('.gameBg').find('.bg' + num);
				$preBg.fadeIn('slow', function() {
					window.setTimeout(function() {
						for(var i = 1; i <= 3; i++) {
							if(i == num) continue;
							$('.gameBg').find('.bg' + i).fadeOut('slow');
							//$('.gameBg').find('.bg' + i).css('zIndex',0)
						};
					}, 1000)
					//$preBg.css('zIndex', 10);
				});
			}, 10000)
		},

		//画线
		drawLineStart: function() {
			var _this = this;
			var $currentBridge = this.currentBridge,
				$line = $currentBridge.find('.line'),
				$lineCon = $line.find('span');
			this.lineHeight = 0;
			this.myInterval = window.setInterval(function() {
				_this.lineHeight += 10;
				$lineCon.height(_this.lineHeight);
			}, 30)
		},

		//画线停止
		drawLineStop: function(callback) {
			var $currentBridge = this.currentBridge;
			var $lineCon = $currentBridge.find('.line span');
			if(this.myInterval) {
				window.clearInterval(this.myInterval);
				this.myInterval = null;
			}
			this.setCss3($lineCon, 'rotate(90deg)', 'all 0.4s ease')
			window.setTimeout(function() {
				if(callback) callback();
			}, 400)
		},

		//游戏数据重置
		reset: function() {
			var $role = this.role;
			var $bridge = this.bridge;
			var len = $bridge.find('li').length;
			for(var i = 0; i < len; i++) {
				if(i > 0) $bridge.find('li').eq(1).remove();
			};
			$role.attr('data-currentx', 70);
			this.setCss3($('.game'), 'translate(0, 0)');
			this.setCss3($role, 'none', 'none');
			$role.css('top', '-75px');
			this.setCss3($bridge.find('li').first().find('.line span'), 'rotate(0deg)', 'none', {
				height: 0
			});
			this.currentLevel = 0;
			this.clearBgInterval();
			$('.success_text').html('')
			$('.hit').unbind('touchstart mousedown');
			//记录分数
		},

		clearBgInterval: function() {
			if(this.bgInterval) {
				window.clearInterval(this.bgInterval);
				this.bgInterval = null;
			}
		},
		//再来一次
		again: function() {
			/*$('.btnIco').hide()
			$('.index_music').show()
			$('.index_rule').show()	*/
			//			------------------new--------------------
			var _this = this;
			$('.infoPage').fadeIn(500, function() {
				_this.reset();
			});
			
		},
		//游戏开始
		gameStart: function() {

		},

		//游戏结束
		gameOver: function() {
			var currentLevel = this.currentLevel;
			var _this = this;
			//记录分数
			_this.postGameLevel();
			$('.failPanel').show();
			$('.failPanel').find('.backBtn').one(END_EV, function() {
				$('.failPanel').hide();
				_this.again();
			})
			$('.failPanel').find('.failTxt').find('img').hide();
//			---------------------new----------------------------

			if(start_number>=2) {
					$('.failPanel').find('.failTxt').find('img').eq(0).show();
					$('.failPanel').find('.success_txt').hide();
				}else{
					$('.failPanel').find('.failTxt').find('img').eq(1).show();
					$('.failPanel').find('.success_txt').show();
					$('.failPanel').find('.success_txt').text(currentLevel);
			}
				
			//保存关卡记录
			_this.postGameLevel(function(data) {
				console.log("postGameLevel:" + data.msg)
				if(data.normal) {
					alert(data.msg);
				} else {
					startMsg = data.msg;
					if(result.msg == "EndTask") {
						_this.msgShow('本活动已经结束，谢谢参与！');
						return;
					} else if(result.msg == "LimitOf") {
						_this.msgShow('每天最多可以参加2次，欢迎明天继续参加..');
					} else if(result.msg == 'NoActivity') {
						_this.msgShow('没有此活动')
					} else if(result.msg = 'NoOpenTask') {
						_this.msgShow('活动还没开始')
					}
				}
			});
		},

		/*---------------------12.21 10.31 注释的ajax------------------------------*/
		/*这里进行ajax请求*/

		//开始游戏
		startGame: function(callback) {
			$.ajax({
					type: "GET",
					dataType: "json",
					url: "js/start.json",
					async: false,

				}).done(function(data) {
					if(callback) callback(data);
				})
				.fail(function() {
				});

		},
		//砸金蛋
		eggGame: function(callback) {
			$.ajax({
					type: "GET",
					dataType: "json",
					url: "js/egg.json",
					async: false,
				})
				.done(function(data) {
					if(callback) callback(data);
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				});

		},
		//提交游戏分数
		postGameLevel: function(callback) {
			var currentLevel = this.currentLevel;

			var code = $("#code").val();
			//提交
			$.ajax({
					url: "js/gameCard.json",
					type: 'GET',
					dataType: 'json',
					data: {
						code: code,
						card: currentLevel
					},
					async: false,

				})
				.done(function(data) {
					console.log("success" + data);
					if(callback) callback(data)

				})
				.fail(function() {
					console.log("error");
				});
		},
		//我的背包奖品
		getServerLevelData: function(callback) {
			$.ajax({
					url: "js/knapsack2.json",
					type: 'GET',
					dataType: 'json',
				})
				.done(function(data) {
					console.log("success" + data);
					if(callback) callback(data);
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				});
		},
		//fail提示框
		msgShow: function(msg) {
			$('.tishi_Panel').show();
			var $scoreTxt = $('.tishi_Panel').find('.tishi_Txt');
			$scoreTxt.html(msg);
			$('.panel').one(END_EV, function() {
				$(this).hide();
			})
		},
		//我的背包提示框
		packShow: function(msg) {
			$('.packPanel').show();
			var $scoreTxt = $('.myPanel').find('.scoreTxt');
			$scoreTxt.html(msg);
			$('.myPanel').one(END_EV, function() {
				$(this).hide();
			})
		},
		success_prize: function(msg) {
			var $prizeTxt = $('.successBox').find('.success_text')
			$prizeTxt.html(msg)
		},

		//砸金蛋
		track_egg: function() {
			//		alert('track_egg');
			$('#dice').show();
			var dice = $("#dice");
			$(".wrap").append("<div id='dice_mask'></div>"); //加遮罩
			dice.attr("class", "dice"); //清除上次动画后的点数
			dice.css('cursor', 'default');
			dice.animate({
				left: '0',
				top: '0'
			}, 350, function() {
				dice.addClass("dice_2");
			}).delay(10).animate({
				left: '0',
				top: '0'
			}, 350, function() {
				dice.removeClass("dice_2").addClass("dice_3");
			}).delay(10).animate({
				left: '0',
				top: '0'
			}, 350, function() {
				dice.removeClass("dice_3").addClass("dice_4");
			}).delay(10).animate({
				left: '0',
				top: '0'
			}, 350, function() {
				dice.removeClass("dice_4").addClass("dice_5");
			}).delay(10).animate({
				left: '0',
				top: '0'
			}, 350, function() {
				dice.removeClass("dice_5").addClass("dice_6");
				$("#dice_mask").remove(); //移除遮罩
			});
			window.setTimeout(function() {
				$('#dice').hide();
			}, 2000)
			//		alert('track_egg_end');
		},

		/*---------------------------------   end     ---------------------------*/
		/**
		 * 获取url参数
		 * return 返回参数值
		 */
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		},

		setDur: function(obj, t, del) {
			var t = t || 1;
			var del = del || 0;
			obj.css({
				'-webkit-animation-duration': t + 's !important',
				'animation-duration': t + 's !important',
				'-webkit-animation-delay': del + 's',
				'animation-delay': del + 's'
			})
		},

		/**
		 * 设置CSS3
		 * @param {[type]} obj    [要操作的对象]
		 * @param {[type]} f      [transform]
		 * @param {[type]} t      [transition]
		 * @param {[type]} attach [其它的属性对象]
		 */
		setCss3: function(obj, f, t, attach) {
			var f = f || 'none',
				t = t || 'none';
			obj.css({
				'transform': f,
				'transition': t,
				'-webkit-transform': f,
				'-webkit-transition': t
			})
			if(attach) obj.css(attach);
		},

		setTransition: function(obj, t) {
			var t = t || 'none';
			obj.css({
				'transition': t,
				'-webkit-transition': t
			})
		}
	}

	//当网页加载完成
	window.onload = function() {
		game.init();
		/*---------------new--------------------*/
		var Bg_game = new Game('canvas');
	}
})