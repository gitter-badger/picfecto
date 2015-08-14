function picChangeInit(canvas) {
    var f = fabric.Image.filters;
    canvas.on({
        'object:selected': function() {
            fabric.util.toArray(document.getElementsByTagName('input'))
                .forEach(function(el) {
                    el.disabled = false;
                })

            var filters = ['grayscale', 'invert', 'remove-white', 'sepia', 'sepia2',
                'brightness', 'noise', 'gradient-transparency', 'pixelate',
                'blur', 'sharpen', 'emboss', 'tint', 'multiply', 'blend'
            ];

            for (var i = 0; i < filters.length; i++) {
                $("#" + filters[i]).checked = !!canvas.getActiveObject().filters[i];
            }
        },
        'selection:cleared': function() {
            fabric.util.toArray(document.getElementsByTagName('input'))
                .forEach(function(el) {
                    el.disabled = true;
                })
        }
    });

    function applyFilter(index, filter) {
        if(!canvas.getActiveObject())
            canvas.setActiveObject(canvas.item(0));

        var obj = canvas.getActiveObject();
        obj.filters[index] = filter;
        obj.applyFilters(canvas.renderAll.bind(canvas));
    }

    function applyFilterValue(index, prop, value) {
        if(!canvas.getActiveObject())
            canvas.setActiveObject(canvas.item(0));
        
        var obj = canvas.getActiveObject();
        if (obj.filters[index]) {
            obj.filters[index][prop] = value;
            obj.applyFilters(canvas.renderAll.bind(canvas));
        }
    }
    /**
     * Resetting Selection to the background image
     **/
    function resetSelection(){
        canvas.setActiveObject(canvas.item(0));
    }
    
    $("#filter_button").click(resetSelection);
    $("#adjust_button").click(resetSelection);

    function handleSticker(e) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                scale = scaleImage(img.height, img.width, 100, 100);
                var imgInstance = new fabric.Image(img, {
                    // scaleX: 0.2,
                    // scaleY: 0.2
                    height: scale.height,
                    width : scale.width
                });
                canvas.add(imgInstance);
                canvas.item(0).hasControls = canvas.item(0).hasBorders = false;
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    $("#pictools").removeClass("disabled");

    var stickerLoader = document.getElementById('stickerLoader');
    stickerLoader.addEventListener('change', handleSticker, false);

    $("#small-image-placeholder").click(function(){
       $("#stickerLoader").click();  
    });



    $(".sticker-btn").click(function() {
        var url = $(this).find("img").attr("src");

        fabric.Image.fromURL(url, function(imgInstance) {
            scale = scaleImage(imgInstance.height, imgInstance.width, 100, 100);
            imgInstance.height = scale.height;
            imgInstance.width = scale.width;
            canvas.add(imgInstance);
            canvas.item(0).hasControls = canvas.item(0).hasBorders = false;
        });

    });


    $('#grayscale').change(function() {
        applyFilter(0, this.checked && new f.Grayscale());
    });
    $('#invert').change(function() {
        applyFilter(1, this.checked && new f.Invert());
    });
    $('#sepia').change(function() {
        applyFilter(3, this.checked && new f.Sepia());
    });
    $('#sepia2').change(function() {
        applyFilter(4, this.checked && new f.Sepia2());
    });


    $('#blur').change(function() {
        applyFilter(9, this.checked && new f.Convolute({
            matrix: [1 / 9, 1 / 9, 1 / 9,
                1 / 9, 1 / 9, 1 / 9,
                1 / 9, 1 / 9, 1 / 9
            ]
        }));
    });
    $('#sharpen').change(function() {
        applyFilter(10, this.checked && new f.Convolute({
            matrix: [0, -1, 0, -1, 5, -1,
                0, -1, 0
            ]
        }));
    });
    $('#emboss').change(function() {
        applyFilter(11, this.checked && new f.Convolute({
            matrix: [1, 1, 1,
                1, 0.7, -1, -1, -1, -1
            ]
        }));
    });

    $('#remove-white').change(function() {
        applyFilter(2, this.checked && new f.RemoveWhite({
            threshold: $('#remove-white-threshold').value,
            distance: $('#remove-white-distance').value
        }));
    });

    $('#remove-white-threshold').change(function() {
        applyFilterValue(2, 'threshold', this.value);
    });
    $('#remove-white-distance').change(function() {
        applyFilterValue(2, 'distance', this.value);
    });
    
   
    // $('#brightness-value').change(function() {
    //     if(!$(this).hasClass("checked")) {
    //         applyFilter(5, new f.Brightness({
    //             brightness: parseInt($('#brightness-value').value, 10)
    //         }));
    //         $(this).addClass("checked");
    //     }
    //     applyFilterValue(5, 'brightness', parseInt(this.value, 10));
    // });

    bindChange($('#brightness-value'), 500, function(val){
        if(!$('#brightness-value').hasClass("checked")) {
            applyFilter(5, new f.Brightness({
                brightness: parseInt(val, 10)
            }));
            $('#brightness-value').addClass("checked");
        }
        applyFilterValue(5, 'brightness', parseInt(val, 10));
    });

    bindChange($('#noise-value'), 500, function(val){
        if(!$('#noise-value').hasClass("checked")) {
            applyFilter(6, new f.Noise({
                noise: parseInt(val, 10)
            }));
            $('#noise-value').addClass("checked");
        }
        applyFilterValue(6, 'noise', parseInt(val, 10));
    });

    $('#gradient-transparency').change(function() {
        applyFilter(7, this.checked && new f.GradientTransparency({
            threshold: parseInt($('#gradient-transparency-value').value, 10)
        }));
    });
    $('#gradient-transparency-value').change(function() {
        applyFilterValue(7, 'threshold', parseInt(this.value, 10));
    });

    bindChange($('#pixelate-value'), 500, function(val){
        if(!$('#pixelate-value').hasClass("checked")) {
             applyFilter(8, new f.Pixelate({
                blocksize: parseInt(val, 10)
            }));
            $('#pixelate-value').addClass("checked");
        }
        applyFilterValue(8, 'blocksize', parseInt(val, 10));
    });

    $('#tint').change(function() {
        applyFilter(12, this.checked && new f.Tint({
            color: document.getElementById('tint-color').value,
            opacity: parseFloat(document.getElementById('tint-opacity').value)
        }));
    });
    $('#tint-color').change(function() {
        applyFilterValue(12, 'color', this.value);
    });
    $('#tint-opacity').change(function() {
        applyFilterValue(12, 'opacity', parseFloat(this.value));
    });

    $("#multiply").colorpicker().on('changeColor', function(event) {
        $("#multiply-color").val(event.color.toHex());
        $("#multiply-color").trigger('changed');
    });
    $('#multiply').change(function() {
        if (this.checked) {
            $('#multiply').colorpicker("show");    
             applyFilter(13, new f.Multiply({
                color: $("#multiply-color").val()
            })); 
        } else {
             applyFilter(13, new f.Multiply({
                color: "transparent"
            })); 
        }   
    });

    function bindChanged(el, timeout, callback) {
        var timer;
        el.bind("changed", function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                callback($(el).val())
            }, timeout);
        });
    }
    function bindChange(el, timeout, callback) {
        var timer;
        el.bind("change", function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                callback($(el).val())
            }, timeout);
        });
    }

    bindChanged($("#multiply-color"), 500, function(val){
         applyFilterValue(13, 'color', val);
    });

    $('#blend').change(function() {
        applyFilter(14, this.checked && new f.Blend({
            color: document.getElementById('blend-color').value,
            mode: document.getElementById('blend-mode').value
        }));
    });

    $('#blend-mode').change(function() {
        applyFilterValue(14, 'mode', this.value);
    });

    $('#blend-color').change(function() {
        applyFilterValue(14, 'color', this.value);
    });

    $("#removeActive").click(function() {
        if(canvas.getActiveObject() && canvas.item(0) !== canvas.getActiveObject())
            canvas.getActiveObject().remove();
    });

    $(window).keyup(function(e) {
        if(e.keyCode === 46)
            if(canvas.getActiveObject() && canvas.item(0) !== canvas.getActiveObject())
                canvas.getActiveObject().remove();
    });
}