$(document).ready(function() {
    var bareFilename = null;
    var fileExtension = null;
    var svgString = null;
    var kicadPcb = null;

    var requiredFeatures = ['svg', 'inlinesvg', 'blobconstructor', 'filereader'];
    var missingFeatures = [];
    requiredFeatures.forEach(function(feature) {
        if (!Modernizr[feature]) {
            missingFeatures.append(feature);
        }
    });
    missingFeatures = missingFeatures.join();

    if (missingFeatures) {
        $('#upgrade-browser-notification').show();
    }

    $('#uploadButton').change(function(event) {
        var file = $('#uploadButton')[0].files[0];
        var baseFilename = file.name;
        var lastDotPosition = baseFilename.lastIndexOf('.');
        bareFilename = baseFilename.substr(0, lastDotPosition);
        fileExtension = baseFilename.substr(lastDotPosition+1).toLowerCase();

        $(new FileReader()).load(function(event) {
            var fileData = event.target.result;
            $('.save-link').hide();
            switch (fileExtension) {
                case 'dxf':
                    svgString = dxfToSvg(fileData);
                    $('#svg-and-kicad-pcb-save-links').show();
                    break;
                case 'svg':
                    svgString = fileData;
                    $('#kicad-pcb-save-link').show();
                    break;
                default:
                    $('#no-save-link').show();
                    return;
            }
            $('#svgImage')[0].src = 'data:image/svg+xml;utf8,' + svgString;
            kicadPcb = svgToKicadPcb(svgString, baseFilename);
        })[0].readAsText(file);
        $('#dxf-input').show();
    });

    $('.saveSvgLink').click(function() {
        if (fileExtension == 'svg' || !svgString) {
            return;
        }
        saveStringAsFile(svgString, bareFilename+'.svg');
    });

    $('.saveKicadPcbLink').click(function() {
        if (!kicadPcb) {
            return;
        }
        saveStringAsFile(kicadPcb, bareFilename+'.kicad_pcb');
    });

    function saveStringAsFile(string, filename)
    {
        var blob = new Blob([string], {type: 'text/plain; charset=utf-8'});
        saveAs(blob, filename);
    }
});
