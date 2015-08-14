function scaleImage(imgHeight, imgWidth, canvasHeight, canvasWidth) {
    var scale ={};
    if (imgWidth > imgHeight) {
        scale.height = canvasHeight;
        scale.width = imgWidth * (canvasHeight / imgHeight);
        scale.lock = "y";
    } else {
        scale.width = canvasWidth;
        scale.height = imgHeight * (canvasWidth / imgWidth);
        scale.lock = "x";
    }
    return scale;
}

$(function() {
    var canvas = new fabric.Canvas('imagecanvas', {
        backgroundColor: 'rgb(240,240,240)'
    });

    var imageLoader = document.getElementById('imageLoader');
    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        showCanvas();
        var reader = new FileReader();
        reader.onload = function (event) {
            var img = new Image();
            img.onload = function () {
                scale = scaleImage(img.height, img.width, canvas.height, canvas.width);
                var imgInstance = new fabric.Image(img, {
                    // scaleX: 0.2,
                    // scaleY: 0.2
                    height: scale.height,
                    width : scale.width
                });
                createImageCanvas(imgInstance, scale.lock);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    

    var imageSaver = document.getElementById('imageSaver');
    imageSaver.addEventListener('click', saveImage, false);

    function saveImage(e) {
        this.href = canvas.toDataURL({
            format: 'jpeg',
            quality: 0.8
        });
        this.download = 'mypicfecto.jpg'
    }

    $("#image-placeholder").click(function(){
       $("#imageLoader").click();  
    });

    $("#defaultPicture").click(function() {
        showCanvas();
        fabric.Image.fromURL("img/defaultpic.jpg", function(imgInstance) {
            scale = scaleImage(imgInstance.height, imgInstance.width, canvas.height, canvas.width);
            imgInstance.height = scale.height;
            imgInstance.width = scale.width;
            createImageCanvas(imgInstance, scale.lock);
        });
    });


    function createImageCanvas(imgInstance, lock) {
        canvas.add(imgInstance);
        canvas.item(0).hasControls = canvas.item(0).hasBorders = false;
        if(lock === "y")
            canvas.item(0).lockMovementY = true;
        else
            canvas.item(0).lockMovementX = true;

        picChangeInit(canvas);
        // $("#setBackgroundImage").click(function(){
        //     var left = canvas.item(0).left,
        //         top = canvas.item(0).top;
        //     canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas),{
        //         height : canvas.height,
        //         width : img.width * (canvas.height / img.height),
        //         left : left,
        //         top : top
        //     });
        //     canvas.remove(canvas.item(0));
        //     $("#setBackgroundImage").hide();
        // });
         // canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas),{
         //    height: canvas.height,
         //    width : img.width * (canvas.height / img.height)
         //    // scaleX: 0.2,
         //    // scaleY: 0.2
         // });  
    }

    function showCanvas() {
        $("#image-placeholder").hide();
        $("#image").show();
        $("#clickHere").hide();
    }

});
