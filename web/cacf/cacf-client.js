define(['baseClient'], function (BaseClient) {
    return _.extend(BaseClient, {

        // Path_getAllData: 'http://10.17.12.22:8180/main/goods/activeInfo',//获取活动详情
        // Path_getAllData: '../cacf/data/detail.json',//获取活动详情
        // path_goCash: "http://10.17.12.22:8180/main/order/confirm",//去支付
        // path_getOptionImg: "http://10.17.12.22:8180/main/goods/detailOptImgs",//获取商品属性图
        // path_getMoreRecord: "http://10.17.12.22:8180/main/crowdFundingRecord/getLuckyNumber",//获取更多中奖纪录
        // path_getMoreRecord: "../cacf/data/moreRecord.json",//获取更多中奖纪录

        Path_getAllData: BaseClient.basePath + "main/goods/activeInfo",//获取活动详情
        path_goCash: BaseClient.basePath + "main/order/confirm",//去支付
        path_getOptionImg: BaseClient.basePath + "main/goods/detailOptImgs",//获取商品属性图
        path_getMoreRecord: BaseClient.basePath + "main/crowdFundingRecord/getLuckyNumber",//获取更多中奖纪录
        path_openPage: BaseClient.basePath + "member/goods/track",//用户打开页面



        //用户打开页面
        openPage: function (params) {
            BaseClient.ajax({
                url: this.path_openPage,
                type: 'post',
                data: {
                    goodsId: params.goodsId
                },
                success: params.success,
                beforeSend: params.beforeSend,
                error: params.error,
                complete: params.complete
            }, false, true);
        },

        //页面
        getAllData: function (params) {
            BaseClient.ajax({
                url: this.Path_getAllData,
                type: 'post',
                data: {
                    productId: params.productId,
                    token: params.token
                },
                success: params.success,
                beforeSend: params.beforeSend,
                error: params.error,
                complete: params.complete
            });

        },

        //去支付
        goCash: function (params) {
            BaseClient.ajax({
                url: this.path_goCash,
                type: 'post',
                data: params.data,
                success: params.success,
                beforeSend: params.beforeSend,
                error: params.error,
                complete: params.complete
            });
        },

        //获取商品属性图
        getOptionImg: function (params){
            BaseClient.ajax({
                url: this.path_getOptionImg,
                type: 'get',
                data: {
                    productId: params.productId
                },
                success: params.success,
                beforeSend: params.beforeSend,
                error: params.error,
                complete: params.complete
            },true);
        },

        //获取更多中奖纪录
        getMoreRecord: function (params){
            BaseClient.ajax({
                url: this.path_getMoreRecord,
                type: 'get',
                data: {
                    pageSize: params.pageSize,
                    pageIndex: params.pageIndex,
                    orderId: params.orderId
                },
                success: params.success,
                beforeSend: params.beforeSend,
                error: params.error,
                complete: params.complete
            },true);
        }


    });

});



