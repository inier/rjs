/**
 * Created by KirK-Jiang on 2015/4/14.
 */
define(['jquery', 'backbone'], function($, Backbone) {
    var mainView = {};
    return Backbone.Router.extend({
        routes: {
            "":"home",//定义当前项目首页
            "*path(?*params)": "main"
        },

        main: function() {
            var router = this;
            var url = decodeURI(location.href);
            var hash = url.split("#");

            if(hash && hash.length>0){
                var viewHash = hash[1].split("?");
                //console.log("open view:   "+viewHash[0]);
                require(["../"+viewHash[0]],function(view){
                    router.changePage(new view());
                });
            }
        },

        home:function(){
            var router = this;
            //console.log("first view:   "+baseClient.firstModule);
            require(['cacf/index'],function(homeView){
                router.changePage(new homeView());

            });
        },

        changePage: function (view) {
            if(this.currentView){
                if(this.currentView == view)
                    return;
                //视图切换前自定义remove操作先
                if(this.currentView.onRemove)
                    this.currentView.onRemove();
                //backbone视图切换
                this.currentView.remove();
            }
            //视图render执行，并填充页面el（html页面加载）
            var v;
            if(!_.has(mainView, view.el.id))
                v = view.render();
            if(v){
            	//隐藏首页
            	$('.details-container .main-page').css("display","none");
            	//隐藏其他页
            	$('.details-container .other-page').css("display","none");
            	//隐藏loading
            	$('#onLoading').removeClass('show');
            	//渲染跳转页
            	var page = $(v.el.id);
            	//已渲染
            	if(page && page.length > 0){
            		page.css("display","block");
            	}
            	//未渲染
            	else{
            		$(v.el).addClass("other-page");
            		$('.details-container').append(v.el);   
            		//$("body").html(v.el);
            	}            	
            }
            else{
                if(!_.has(mainView,view.el.id))
                    mainView[view.el.id] = view;
            	//隐藏跳转页
            	$('.other-container .other-page').css("display","none");
            	//显示首页
            	$('.details-container .main-page').css("display","block");            	
            }
            
            this.currentView = view;
          //el填充后视图show执行（业务ajax执行填充模板）
            var param = window.BackboneViewParams;
        	if(param){
        		try{
        			view.onShow(param);
        		}
        		catch (e) {
					// TODO: handle exception
				}
        		window.BackboneViewParams = undefined;
        	}
        	else{
        		view.onShow();
        	}
        }
    });
});