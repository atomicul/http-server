//
// Created by pijon on 12/9/24.
//

#include "SingletonProvider.h"

#include "configuration/Configuration.h"

namespace http_uploader {
    using namespace configuration;

    std::unique_ptr<abstract::IConfiguration> SingletonProvider::_configuration = nullptr;

   abstract::IConfiguration *SingletonProvider::configuration() {
        if (_configuration)
            return _configuration.get();
        _configuration = std::make_unique<Configuration>();

       return _configuration.get();
    }
} // http_uploader