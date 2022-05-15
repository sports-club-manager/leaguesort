
var _defaults = {
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0
};

var opts = {};

var options = function(_opts) {
    opts = _opts;
};

var calculateTable = function(results, table, comparator) {

    var table = table ? table : []
    var results = results ? results : []
    var winPoints = (opts.winPoints ? opts.winPoints : _defaults.winPoints);
    var drawPoints = (opts.drawPoints ? opts.drawPoints : _defaults.drawPoints);
    var lossPoints = (opts.lossPoints ? opts.lossPoints : _defaults.lossPoints);

    var applyResult = function(home, away, homeGoals, awayGoals) {
        home.played++;
        away.played++;
        var res = 0;
        if (homeGoals > awayGoals) {
            home.won++;
            away.lost++;
            home.points += winPoints;
            away.points += lossPoints;
            res = 1;
        }
        else if (homeGoals === awayGoals) {
            home.drawn++;
            away.drawn++;
            home.points += drawPoints;
            away.points += drawPoints;
        }
        else {
            home.lost++;
            away.won++;
            away.points += winPoints;
            home.points += lossPoints;
            res = -1;
        }
        home.goalsFor += homeGoals;
        away.goalsFor += awayGoals;
        home.goalsAgainst += awayGoals;
        away.goalsAgainst += homeGoals;

        // record head to head
        home.versus.push({
            name: away.name, res: res
        });
        away.versus.push({
            name: home.name, res: -res
        });
    };

    var defaultComparator = function(a, b) {
        // points
        if (a.points > b.points) return -1;
        if (a.points < b.points) return 1;

        // GD
        var aGD = a.goalsFor - a.goalsAgainst;
        var bGD = b.goalsFor - b.goalsAgainst;
        if (aGD > bGD) return -1;
        if (aGD < bGD) return 1;

        // scored
        if (a.goalsFor > b.goalsFor) return -1;
        if (a.goalsFor < b.goalsFor) return 1;

        // wins
        if (a.won > b.won) return -1;
        if (a.won < b.won) return 1;

        // head to head
        if (b.versus.length > 0) {
            var c = 0;
            for (var g = 0; g < a.versus.length; g++) {
                if (b.versus[g] !== undefined) {
                    c += (b.versus[g].name === a.name ? b.versus[g].res : 0);
                }
            }
            if (c != 0) {
                return c;
            }
        }

        // name
        return (a.name > b.name ? 1 : -1);

    };

    var findEntryInTable = function(name) {
        for (var i = 0; i < table.length; i++) {
            if (table[i].name === name) return table[i];
        }

        var entry = {played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, versus:[]};
        entry.name = name;
        table.push(entry);
        return entry;
    };

    for (var i = 0; i < results.length; i++) {
        var newResult = results[i];
        var ht = findEntryInTable(newResult.homeTeam);
        var at = findEntryInTable(newResult.awayTeam);
        if ('homeGoals' in newResult) {
            var hg = newResult.homeGoals;
            var ag = newResult.awayGoals;
            applyResult(ht, at, hg, ag);
        }
    }
    table.sort(comparator ? comparator : defaultComparator);
    return table;
};

exports.calculateTable = calculateTable;
exports.options = options;
