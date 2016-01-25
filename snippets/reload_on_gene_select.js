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
    if (!gene.gene) { // It is not a transcript
        gB.gene (gene.id);
        cttvGenomeBrowser.start();
    }
});
