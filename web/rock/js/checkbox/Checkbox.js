define([ 'jquery'], function($) {
	
	$(document.body).on('click','.checkbox:not(.disabled), .checkbox2:not(.disabled),.checkbox-lg:not(.disabled)',function(){
		$(this).toggleClass("checked");		
	});

	
	$(document.body).on('click','.radio',function(){
		$(".radio[data-group="+$(this).attr('data-group')+"]").removeClass("checked");
		$(this).addClass("checked");
	});
	
	return {
		getCheckboxValue:function(selector){
			var obj = $(selector);
			if(obj && obj.length > 0){
				return obj.first().hasClass('checked');
			}
		},
		
				
		getRadioValue:function(group){
			var result;
			$(".radio[data-group="+group+"]").each(function(index, dom){
				var el = $(dom);
				if(el.hasClass('checked')){
					result = el.attr("data-value");
					return false;
				}
			});
			return result;
		}
	}
});