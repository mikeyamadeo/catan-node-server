module.exports = {


    //works for edges and verticies
    isLocationEqual : function(loc1, loc2) {
        return (loc1.x === loc2.x && loc1.y === loc2.y && loc1.direction === loc2.direction );
    },

    containsEdge : function (edge, edges) {
        var connected = false;
        for (var edge in adjEdges) {
                if (helpers.isLocationEqual(road, edge)) {
                    connected = true;
                    break;
                }
        }
        return connected;
    }
};