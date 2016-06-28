//var ensembl_rest_api = require("tnt.ensembl");
var nav = require("./navigation.js");
var browser_tooltips = require("./tooltips.js");
var aggregation = require("./aggregation.js");
var RSVP = require('rsvp');
var apijs = require("tnt.api");
var biotypes = require("./biotypes.js");
var cttvRestApi = require("cttv.api");
var pipelines = require("./pipelines.js");

var cttv_genome_browser = function() {
    "use strict";

    // Options for the widget
    var conf = {
        links_prefix: "https://www.targetvalidation.org",
        show_links: true,
        show_snps: true,
        show_nav: true,
        cttvRestApi: cttvRestApi().prefix("https://www.targetvalidation.org/api/"),
        efo: undefined
    };

    var tracks = {};

    // Public apif
    var myApi;

    var navTheme = nav();

    // var show_links   = true;
    // var efo;

    var snp_new_legend;

    // Divs
    var snp_legend_div;
    var navDiv;

    var snpColors = {
        TargetDisease: "#FF0000", // red
        Target: "#3e9999", // blue
        Disease: "#FFD400", // orange
        Other: "#cccccc" // grey
    };

    var ensemblRestApi;

    // div_ids to display different elements
    // They have to be set dynamically because the IDs contain the div_id of the main element containing the plug-in
    var div_id;

    var geneTrackHeight = 0;

    var gBrowser;

    var gBrowserTheme = function(gB, div) {

        // Set the different #ids for the html elements (needs to be lively because they depend on the div_id)
        set_div_id(div);
        gBrowser = gB;
        gB.zoom_in(150);

        ensemblRestApi = tnt.board.track.data.genome.ensembl;
        //ensemblRestApi = gB.rest();

        // If the nav is shown or not
        navTheme
            .show_options(conf.show_nav);

        // tooltips
        var tooltips = browser_tooltips()
            .cttvRestApi (conf.cttvRestApi)
            .ensemblRestApi (ensemblRestApi)
            .prefix (conf.links_prefix)
            .view (gB);

        // Transcript data
        var mixedData = tnt.board.track.data.genome.gene();
        var gene_updater = mixedData.retriever();
        mixedData.retriever (function (loc) {
            return gene_updater(loc)
                .then (function (fullGenes) {
                    var genes = [];
                    for (var i=0; i<fullGenes.length; i++) {
                        var gene = fullGenes[i];
                        if (gene.id !== gB.gene()) {
                            gene.key = gene.id;
                            gene.isGene = true;
                            gene.exons = [{
                                start: gene.start,
                                end: gene.end,
                                coding: true,
                                offset: 0,
                                isGene: true
                            }];
                            genes.push(gene);
                        }
                    }

                    var url = ensemblRestApi.url()
                        .endpoint("/lookup/id/:id")
                        .parameters({
                            id: gB.gene(),
                            expand: true
                        });
                    // var url = ensemblRestApi.url.gene({
                    //     id: gB.gene(),
                    //     expand: true
                    // });
                    return ensemblRestApi.call(url)
                        .then (function (resp) {
                            var g = resp.body;
                            var tss = tnt.board.track.data.genome.transcript().gene2Transcripts(g);
                            for (var i=0; i<tss.length; i++) {
                                var ts = tss[i];
                                if (overlaps([loc.from, loc.to], [ts.start, ts.end])) {
                                    genes.push(ts);
                                }
                            }
                            // genes = genes.concat(tss);
                            genes.map(gene_color);
                            setupLegend(genes);
                            return genes;
                        });
                });
        });

        var overlaps = function (ref, feat) {
            if (ref[0] < feat[0] && ref[1] > feat[1]) { // feat inside
                return true;
            }
            if (ref[0] > feat[0] && ref[1] < feat[1]) { // inside -- right
                return true;
            }
            if (ref[0] > feat[0] && ref[1] > feat[1]) { // inside -- left
                return true;
            }
            if (ref[1] > feat[0] && ref[1] < feat[1]) { // feat expands both sides
                return true;
            }
            return false;
        };

        var getBiotypes = function (genes) {
            // get the biotypes:
            var biotypes_array = genes.map(function(e){
                return biotypes.legend[e.biotype];
            });
            // also the ones for the transcript of the matching gene
            var transcript_biotypes = genes.filter (function (e2) {
                if (e2.gene) {
                    return e2.gene.id === gB.gene();
                }
                return e2.id === gB.gene();
                //return e2.gene.id === gB.gene();
            }).map (function (e) {
                return biotypes.legend[e.biotype];
                //return biotypes.legend[e.transcript.biotype];
            });

            biotypes_array = biotypes_array.concat(transcript_biotypes);

            var biotypes_hash = {};
            for (var i=0; i<biotypes_array.length; i++) {
                biotypes_hash[biotypes_array[i]] = 1;
            }
            var curr_biotypes = [];
            for (var p in biotypes_hash) {
                if (biotypes_hash.hasOwnProperty(p)) {
                    var b = {};
                    b.label = p;
                    b.color = biotypes.color[p];
                    curr_biotypes.push(b);
                }
            }

            myApi.get("biotypes", curr_biotypes);
            return curr_biotypes;
        };

        var setupLegend = function (genes) {
            var curr_biotypes = getBiotypes(genes);
            var biotype_legend = gene_legend_div.selectAll(".tnt_biotype_legend")
                .data(curr_biotypes, function(d){
                    return d.label;
                });

            var new_legend = biotype_legend
                .enter()
                .append("div")
                .attr("class", "tnt_biotype_legend")
                .style("display", "inline");

            new_legend
                .append("div")
                .style("display", "inline-block")
                .style("margin", "0px 5px 0px 15px")
                .style("width", "10px")
                .style("height", "10px")
                .style("border", "1px solid #000")
                .style("background", function(d){
                    return d.color;
                });

            new_legend
                .append("text")
                .text(function(d){return d.label;});

            biotype_legend
                .exit()
                .remove();

        };

        // TRACKS!
        // ClinVar track
        var regionEnsemblPromise = function (loc) {
            var regionUrl = ensemblRestApi.url()
                .endpoint("overlap/region/:species/:region")
                .parameters({
                    species: loc.species,
                    region: (loc.chr + ":" + loc.from + "-" + loc.to),
                    feature: ["gene"]
                });
            // var regionUrl = ensemblRestApi.url.region ({
            //     species: loc.species,
            //     chr: loc.chr,
            //     from: loc.from,
            //     to: loc.to,
            //     features: ["gene"]
            // });
            return ensemblRestApi.call(regionUrl)
                .then (function (resp) {
                    return resp.body;
                });
        };

        var clinvar_updater = tnt.board.track.data.async()
            .retriever (function (loc) {
                return regionEnsemblPromise(loc)
                    .then (function (genes) {
                        var allGenesPromises = [];
                        var geneIds = [];
                        for (var i=0; i<genes.length; i++) {
                            geneIds.push(genes[i].id);
                        }
                        var p = pipelines()
                        .ensemblRestApi (ensemblRestApi)
                        .cttvRestApi (conf.cttvRestApi)
                        .rare(geneIds, conf.efo);
                        allGenesPromises.push(p);
                        return RSVP.all(allGenesPromises);
                    })
                    .then (function (resps) {
                        var flattenedSNPs = [];
                        for (var i=0; i<resps.length; i++) {
                            var resp = resps[i];
                            for (var snp in resp.snps) {
                                if (resp.snps.hasOwnProperty(snp)) {
                                    flattenedSNPs.push (resp.snps[snp]);
                                }
                            }
                        }
                        return flattenedSNPs;
                    });
            });

        var foreground_color = function (d) {
            // highlight means same disease
            if (d.highlight && (gB.gene() === d.target.geneid)) {
                return snpColors.TargetDisease;
            } else if (d.highlight) {
                return snpColors.Disease;
            } else if (gB.gene() === d.target.geneid) {
                return snpColors.Target;
            }
            return snpColors.Other;
        };

        var clinvar_display = tnt.board.track.feature.pin()
            .domain([0.3, 1.2])
            .color (foreground_color)
            .index(function (d) {
                return d.name;
            })
            .on("click", tooltips.snp)
            .layout(tnt.board.track.layout()
                .elements(function(elems) {
                    aggregation(elems, clinvar_display.scale());
                })
            );

        var clinvar_track = tnt.board.track()
            .label("Variants in rare diseases")
            .height(60)
            .color("white")
            .display(clinvar_display)
            .data (clinvar_updater);

        // Async Gwas updater for ALL genes
        var gwas_updater = tnt.board.track.data.async()
            .retriever (function (loc) {
                return regionEnsemblPromise(loc)
                    .then (function (genes) {
                        var allGenesPromises = [];
                        var geneIds = [];
                        for (var i=0; i<genes.length; i++) {
                            geneIds.push(genes[i].id);
                        }
                        var gene = genes[i];
                        var p = pipelines()
                            .ensemblRestApi (ensemblRestApi)
                            .cttvRestApi (conf.cttvRestApi)
                            .common(geneIds, conf.efo);
                        allGenesPromises.push(p);

                        return RSVP.all(allGenesPromises);
                    })
                    .then (function (resps) {
                        var flattenedSNPs = [];
                        for (var i=0; i<resps.length; i++) {
                            var resp = resps[i];
                            for (var snp in resp.snps) {
                                if (resp.snps.hasOwnProperty(snp)) {
                                    flattenedSNPs.push(resp.snps[snp]);
                                }
                            }
                        }
                        return flattenedSNPs;
                    });
            });

        // Gwas track
        var gwas_display = tnt.board.track.feature.pin()
            .domain([0.3,1.2])
            .index(function (d) {
                return d.name;
            })
            .color (foreground_color)
            .on("click", tooltips.snp)
            .layout(tnt.board.track.layout()
                .elements(function (elems) {
                    aggregation(elems, clinvar_display.scale());
                })
            );

        //var gwas_guider = gwas_display.guider();
        // gwas_display.guider (function (width) {
        //     var track = this;
        //     var p0_offset = 16.11;
        //     var p05_offset = 43.88
        //
        //     // pvalue 0
        //     track.g
        //     .append("line")
        //     .attr("x1", 0)
        //     .attr("y1", p0_offset)
        //     //.attr("y1", y_offset)
        //     .attr("x2", width)
        //         .attr("y2", p0_offset)
        //     //.attr("y2", y_offset)
        //     .attr("stroke", "lightgrey");
        //     track.g
        //     .append("text")
        //     .attr("x", width - 50)
        //     .attr("y", p0_offset + 10)
        //     .attr("font-size", 10)
        //     .attr("fill", "lightgrey")
        //     .text("pvalue 0");

        // pvalue 0.5
        // track.g
        // 	.append("line")
        // 	.attr("x1", 0)
        // 	.attr("y1", p05_offset)
        // 	.attr("x2", width)
        // 	.attr("y2", p05_offset)
        // 	.attr("stroke", "lightgrey")
        // track.g
        // 	.append("text")
        // 	.attr("x", width - 50)
        // 	.attr("y", p05_offset + 10)
        // 	.attr("font-size", 10)
        // 	.attr("fill", "lightgrey")
        // 	.text("pvalue 0.5");

        // continue with rest of guider
        //gwas_guider.call(track, width);

        //});

        var gwas_track = tnt.board.track()
            .label("Variants in common diseases")
            .height(60)
            .color("white")
            .display(gwas_display)
            .data (gwas_updater);

        // Aux track for label
        var transcript_label_track = tnt.board.track()
            .label ("Genes / Transcripts")
            .height(20)
            .color ("white")
            .display(tnt.board.track.feature.block())
            .data(tnt.board.track.data.sync()
                    .retriever (function () {
                        return [];
                    })
            );

        // Transcript / Gene track
        var transcript_track = tnt.board.track()
            .height(geneTrackHeight)
            .color("white")
            .display(tnt.board.track.feature.genome.transcript()
                .color (function (t) {
                    return t.featureColor;
                })
                .on("click", tooltips.gene)
            )
            // .data(transcript_data);
            .data(mixedData);

        // Update the track based on the number of needed slots for the genes
        transcript_track.display().layout()
            .keep_slots(false)
            .fixed_slot_type("expanded")
            .on_layout_run (function (types, current) {
                var needed_height = types.expanded.needed_slots * types.expanded.slot_height;
                if (needed_height !== geneTrackHeight) {
                    if (needed_height < 200) { // Minimum of 200
                        geneTrackHeight = 200;
                    } else {
                        geneTrackHeight = needed_height;
                    }
                    geneTrackHeight = needed_height;
                    transcript_track.height(needed_height);
                    gB.tracks(gB.tracks()); // reorder re-computes track heights
                }
        });


        // Sequence track
        var sequence_track = tnt.board.track()
            .label ("sequence")
            .height(30)
            .color("white")
            .display(tnt.board.track.feature.genome.sequence())
            .data(tnt.board.track.data.genome.sequence()
                .limit(200)
            );

        gBrowserTheme.start();

        // The order of the elements are: Nav div // genome browser div // legend div
        // nav div
        navDiv = d3.select(div)
            .append("div")
            .style("width", "950px");

        gBrowser(div);

        // The legend for the gene colors
        var gene_legend_div = d3.select(div)
            .append("div")
            .attr("class", "tnt_legend_div");

        gene_legend_div
            .append("text")
            .attr("class", "tnt_legend_header")
            .text("Gene legend:");

         d3.selectAll("tnt_biotype")
            .data(transcript_track.data().elements());

        // The legen for the snps colors
        snp_legend_div = d3.select(div)
            .append("div")
            .attr("class", "tnt_legend_div");
        snp_legend_div
            .append("text")
            .attr("class", "tnt_legend_header")
            .text("SNPs legend:");

        if (conf.show_snps) {
            tracks.common_snps = gwas_track;
            gBrowser.add_track(gwas_track);

            tracks.rare_snps = clinvar_track;
            gBrowser.add_track(clinvar_track);
        }

        tracks.gene = transcript_track;
        gBrowser
            .add_track(sequence_track)
            .add_track(transcript_label_track)
            .add_track(transcript_track);


        // Links div
        var links_pane = d3.select(div)
            .append("div")
            .attr("class", "tnt_links_pane")
            .style("display", function() {
                if (conf.show_links) {
                    return "block";
                } else {
                    return "none";
                }
            });

        // ensembl
        links_pane
            .append("span")
            .text("Open in Ensembl");

        var ensemblLoc = links_pane
            .append("i")
            .attr("title", "open region in ensembl")
            .attr("class", "cttvGenomeBrowserIcon fa fa-external-link fa-2x")
            .on("click", function() {var link = buildEnsemblLink(); window.open(link, "_blank");});

    };

    ///*********************////
    /// RENDERING FUNCTIONS ////
    ///*********************////
    // API
    // DATA
    var start = function () {
        var geneUrl = ensemblRestApi.url()
            .endpoint("lookup/id/:id")
            .parameters({
                id: gBrowser.gene()
            });
        // var geneUrl = ensemblRestApi.url.gene ({
        //     id: gB.gene()
        // });
        var genePromise = ensemblRestApi.call(geneUrl)
            .then (function (resp) {
                return resp.body;
            });

        var diseasePromise;
        if (conf.efo) {
            var efoUrl = conf.cttvRestApi.url.disease({
                code: conf.efo
            });

            diseasePromise = conf.cttvRestApi.call(efoUrl)
                .then (function (resp) {
                    return resp.body;
                });
        }

        // // SNPs ClinVar
        var snpsClinvarPromise;
        if (conf.show_snps) {
            snpsClinvarPromise = pipelines()
                .ensemblRestApi (ensemblRestApi)
                .cttvRestApi (conf.cttvRestApi)
                .rare (gBrowser.gene());
        } else {
            snpsClinvarPromise = new Promise (function (res, rej) {
                res({});
            });
        }

        // // SNP GWASs
        var snpsGwasPromise;
        if (conf.show_snps) {
            snpsGwasPromise = pipelines()
                .ensemblRestApi (ensemblRestApi)
                .cttvRestApi (conf.cttvRestApi)
                .common (gBrowser.gene());
        } else {
            snpsGwasPromise = new Promise (function (resolve, reject) {
                resolve({});
            });
        }

        RSVP.all ([genePromise, snpsGwasPromise, snpsClinvarPromise, diseasePromise])
            .then (function (resps) {
                var disease = resps[3];
                var gene = resps[0];
                fillSNPLegend (gene, disease);
                var gene_extent = [gene.start, gene.end];
                var gwas_extent = resps[1].extent;
                var clinvar_extent = resps[2].extent;

                var gwasLength = gwas_extent ? (gwas_extent[1] - gwas_extent[0]) : 0;
                var clinvarLength = clinvar_extent ? (clinvar_extent[1] - clinvar_extent[0]) : 0;
                var geneLength = gene_extent[1] - gene_extent[0];
                //
                var gwasStart = gwas_extent ? (~~(gwas_extent[0] - (gwasLength/5))) : Infinity;
                var gwasEnd   = gwas_extent ? (~~(gwas_extent[1] + (gwasLength/5))) : -Infinity;
                var clinvarStart = clinvar_extent ? (~~(clinvar_extent[0] - (clinvarLength/5))) : Infinity;
                var clinvarEnd = clinvar_extent ? (~~(clinvar_extent[1] + (clinvarLength/5))) : -Infinity;
                var geneStart = ~~(gene_extent[0] - (geneLength/5));
                var geneEnd   = ~~(gene_extent[1] + (geneLength/5));
                //
                var start = d3.min([gwasStart||Infinity, geneStart, clinvarStart||Infinity]);
                var end   = d3.max([gwasEnd||0, geneEnd, clinvarEnd||0]);
                //
                // var zoomOut = (gene.end - gene.start) + 100;
                // gB.zoom_out(zoomOut);
                // We can finally start!
                gBrowser.chr(gene.seq_region_name);
                navTheme.orig ({
                    from : start,
                    to : end
                });
                gBrowser.start({from: start, to: end});

                // Navigation
                // Needs to be positioned here because it needs to know the chromosome
                navTheme (gBrowser, navDiv.node());
            });
    };

    var fillSNPLegend = function (gene, disease) {
        var snp_legend_data = [];
        if (disease) {
            snp_legend_data.push({
                label: "SNP in " + gene.display_name + " associated with " + disease.label,
                color: snpColors.TargetDisease
            });
            snp_legend_data.push({
                label: "SNP associated with " + disease.label + " in other genes",
                color: snpColors.Disease
            });
        }
        snp_legend_data.push({
            label: "SNP in " + gene.display_name,
            color: snpColors.Target
        });
        snp_legend_data.push({
            label: "Other SNP",
            color: snpColors.Other
        });

        snp_new_legend = snp_legend_div.selectAll(".tnt_snp_legend")
            .data(snp_legend_data)
            .enter()
            .append("div")
            .attr("class", "tnt_snp_legend");

        snp_new_legend
            .append("div")
            .attr("class", "tnt_legend_item")
            .style("display", "inline-block")
            .style("margin", "0px 5px 0px 15px")
            .style("width", "10px")
            .style("height", "10px")
            .style("border", "1px solid #000")
            .style("border-radius", "5px")
            .style("background", function(d){
                return d.color;
            });

        snp_new_legend
            .append("text")
            .text(function(d) {
                return d.label;
            });

    };

    myApi = apijs(gBrowserTheme)
        .getset(conf)
        .method('start', start)
        .method ("track", function (name) {
            switch (name) {
                case "gene":
                return tracks.gene;
                case "common_snps":
                return tracks.common_snps;
                case "rare_snps":
                return tracks.rare_snps;
            }
            return; // No track returned
        });

    var set_div_id = function(div) {
        div_id = d3.select(div).attr("id");
    };


    ///*********************////
    /// UTILITY METHODS     ////
    ///*********************////
    // Private methods

    var buildEnsemblLink = function() {
        var url = "http://www.ensembl.org/" + gBrowser.species() + "/Location/View?r=" + gBrowser.chr() + "%3A" + gBrowser.from() + "-" + gBrowser.to();
        return url;
    };


    function gene_color (transcript) {
        var biotype = transcript.biotype;

        var color = biotypes.color[biotypes.legend[biotype]];
        transcript.featureColor = color;

        // colors must be set in the exons too
        for (var i=0; i<transcript.exons.length; i++) {
            transcript.exons[i].featureColor = color;
        }

    }

    // Public methods


    /** <strong>buildEnsemblGeneLink</strong> returns the Ensembl url pointing to the gene summary of the given gene
    @param {String} gene The Ensembl gene id. Should be a valid ID of the form ENSGXXXXXXXXX"
    @returns {String} The Ensembl URL for the given gene
    */
    var buildEnsemblGeneLink = function(ensID) {
        //"http://www.ensembl.org/Homo_sapiens/Gene/Summary?g=ENSG00000139618"
        var url = "http://www.ensembl.org/" + gBrowser.species() + "/Gene/Summary?g=" + ensID;
        return url;
    };

    return gBrowserTheme;
};

module.exports = exports = cttv_genome_browser;
