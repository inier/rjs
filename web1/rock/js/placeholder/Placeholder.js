define([ 'jquery'], function($) {
	
	$(document.body).on("click", "[data-placeholder-for]", function(){
		if($(this).siblings("input").attr("disabled")){
			return;
		}
		$(this).hide();
		$($(this).attr('data-placeholder-for')).focus();
	});
	
	$(document.body).on("focus","input,select,textarea",function(){
		var input = $(this);
		$(document.body).find("[data-placeholder-for]").each(function(index,el){
			if(input[0] == $($(el).attr('data-placeholder-for'))[0]){
				$(el).hide();
			}		
		});
	});
	
	
	$(document.body).on("blur","input,select,textarea",function(){
		var input = $(this);
		$(document.body).find("[data-placeholder-for]").each(function(index,el){
			if(input[0] == $($(el).attr('data-placeholder-for'))[0]){
				if(input && (input.val() == null || input.val().length == 0)){
					$(el).show();
				}
			}			
		});
	});

});