/// <reference path="../camelPlugin.ts"/>
/// <reference path="properties.service.ts"/>

interface JQuery {
  tooltip(): JQuery;
}

module Camel {

  _module.controller("Camel.PropertiesController", ["$scope", "$rootScope", "workspace", "localStorage", "jolokia",
    'propertiesService', ($scope, $rootScope, workspace: Workspace, localStorage: WindowLocalStorage, jolokia,
    propertiesService: PropertiesService) => {

      var log: Logging.Logger = Logger.get("Camel");

      $scope.$on("$routeChangeSuccess", function (event, current, previous) {
        // lets do this asynchronously to avoid Error: $digest already in progress
        setTimeout(updateData, 50);
      });

      function updateData() {
        let routeXmlNode = getSelectedRouteNode(workspace);

        if (routeXmlNode) {
          let data = getRouteNodeJSON(routeXmlNode);
          let schema = getCamelSchema(routeXmlNode.nodeName);
          addValueToProperties(data, schema);
          
          if (log.enabledFor(Logger.DEBUG)) {
            log.debug("Properties - data: " + JSON.stringify(data, null, "  "));
            log.debug("Properties - schema: " + JSON.stringify(schema, null, "  "));
          }

          // // labels is named group in camelModel.js
          // var labels = [];
          // if ($scope.model.group) {
          //   labels = $scope.model.group.split(",");
          // }
          // $scope.labels = labels;

          $scope.icon = getRouteNodeIcon(routeXmlNode);
          $scope.title = schema.title;
          $scope.description = schema.description;
          $scope.definedProperties = propertiesService.getDefinedProperties(schema);
          $scope.defaultProperties = propertiesService.getDefaultProperties(schema);
          $scope.undefinedProperties = propertiesService.getUndefinedProperties(schema);
          $scope.viewTemplate = "plugins/camel/html/nodePropertiesView.html";

          Core.$apply($scope);
        }
      }

      function addValueToProperties(data, schema) {
        for (let key in data) {
          let property = schema.properties[key];
          if (property) {
            property.value = data[key];
          }
        }
      }

      setTimeout(function() {
        $('[data-toggle=tooltip]').tooltip();
      }, 1000);

    }]);

}
