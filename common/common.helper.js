module.exports = {


    //works for edges and verticies
    isLocationEqual : function(loc1, loc2) {
        return (loc1.location.x === loc2.location.x && loc1.location.y === loc2.location.y && loc1.location.direction === loc2.location.direction );
    },

    isRoadOnEdges : function (road, edges) {
        var connected = false;
        for (var edge in adjEdges) {
                if (helpers.isLocationEqual(road.location, edge)) {
                    connected = true;
                    break;
                }
        }
        return connected;
    }
};