jQuery(document).ready(function($) {

    var holder  = $('#dropzone'),
        state   = $('state'),
        doc     = $(document);

    doc.on('dragenter', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    doc.on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    doc.on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        console.log('släppt');
    });


    if (typeof window.FileReader === 'undefined') {
        state.innerHTML('DU SUGER SOM INTE HAR SHIT');
    }
    holder.on('dragenter', function(event) {
        event.stopPropagation();
        event.preventDefault();
        holder.addClass('hover');
        return false;
    });

    holder.on('dragleave', function(event) {
        event.stopPropagation();
        event.preventDefault();
        holder.removeClass('hover');
        return false;
    });

    holder.on('drop', function(event) {
        event.stopPropagation();
        event.preventDefault();
        holder.removeClass('hover');
        var file = event.originalEvent.dataTransfer.files[0],
            reader = new FileReader();
            console.log(file);


        reader.readAsDataURL(file);

        return false;
     });

});
