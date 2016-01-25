var gB = tnt.board.genome()
    .species("human")
    .gene("ENSG00000157764")
    .width(950);

var cttvGenomeBrowser = targetGenomeBrowser()
    .show_nav(false)
    .show_links(false);

cttvGenomeBrowser(gB, yourDiv);

var geneTrack = cttvGenomeBrowser.track("gene");
geneTrack.display().on("click", function (gene) {
    var elem = this;
    var tooltip_obj = function (g) {
        var obj = {};
        obj.header = (g.display_name || g.external_name) + " (" + g.id + ")";
        obj.rows = [];

        obj.rows.push( {
            "label" : "Biotype",
            "value" : g.biotype
        });

        obj.rows.push( {
            "label" : "Description",
            "value" : g.description || g.gene.description
        });

        return obj;
    };
    tnt.tooltip.table()
        .call(elem, tooltip_obj(gene));
});
