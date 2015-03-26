module.exports = {


    //works for edges and verticies
    isLocationEqual : function(loc1, loc2) {
        return (loc1.x === loc2.x && loc1.y === loc2.y && loc1.direction === loc2.direction );
    },

    containsEdge : function (edge, edges) {
        var connected = false;
        var that = this;
        edges.forEach(function (edge2) {
            if (that.isLocationEqual(edge, edge2)) {
                connected = true;
                return;
            }
        });
        return connected;
    }
};