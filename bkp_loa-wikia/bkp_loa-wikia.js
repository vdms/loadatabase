
(function() {
    var app = angular.module('LoADBapp', []);
    
    app.controller('LoADB', function ($http){
        var _s = _.string;
        var dataTable, allCards;
        var pageId = 4158;
        var tableSource = 'http://lies-of-astaroth.wikia.com/api.php?action=query&pageids=' + pageId + '&rvprop=content&prop=revisions&format=json&callback=JSON_CALLBACK'; 
        var self = this;
            
        var formatTable = function (response) {
            var data = response.data;
            
            dataTable = data.query.pages[pageId].revisions[0]["*"];
            
            // dataTable sem as informações excedentes
            var cleanDataTable = _s.words(_s.strLeftBack (_s.strRight(_s.strRight(dataTable, "|-"), "|-"),"|}"),"|-");

            // separação de cada linha da tabela em arrays
            var fullTable = cleanDataTable.map(cardSplit);

            // remoção de arrays vazios
            var cleanFullTable = _.filter(fullTable, function(obj){ return obj.length > 2; });

            // pega os valores de cada array e relaciona a uma key.
            allCards = cleanFullTable.map(bindKeys);
            
            var addCardPageID = allCards.map(findCardPage);
            
            self.cards = addCardPageID;
        };
        
        var formatTableError    = function (response) { console.log("Deu merda", response); };
        
        $http.jsonp(tableSource).then(formatTable, formatTableError);
        
        var bindKeys = function(obj){
            obj = _.object(['id', 'image', 'name', 'cost', 'star', 'race', 'wait', 'atk', 'hp'], obj);     
            return obj;
        }

        var removeBrackets      = function(obj) {
            obj = obj.replace("[[","").replace("]]","");
            return obj;                        
        }

        var cardSplit =  function(cardString){
            var cardValuesString = _s.trim(_s.trim(cardString).split("||"),"|");
            var cardValuesArray = _s.words(_s.clean(cardValuesString)," , ").map(removeBrackets);                 
            return cardValuesArray;
        }
        
        var findCardPage = function(obj) {
            var cardSource = 'http://lies-of-astaroth.wikia.com/api.php?action=query&format=json&callback=JSON_CALLBACK&ids=1&titles=' + obj.name.replace(" ","_");
            $http.jsonp(cardSource).then(getCardPageId, getCardPageIdError);
            return obj;
        }
        
        
        var getCardPageId = function(response) {
            var data = response.data;
            var cardId = _.keys(data.query.pages);
            data.cardPageId = cardId;
            return data;
        }
        
        
        var getCardPageIdError    = function (response) { console.log("Deu merda 2", response); }

    });
})();