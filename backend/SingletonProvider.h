//
// Created by pijon on 12/9/24.
//

#ifndef SINGLETONPROVIDER_H
#define SINGLETONPROVIDER_H
#include <memory>

#include "configuration/abstract/IConfiguration.h"

namespace http_uploader {
    using namespace configuration;

class SingletonProvider {
public:
    static abstract::IConfiguration *configuration();
private:
    static std::unique_ptr<abstract::IConfiguration> _configuration;
};

} // http_uploader

#endif //SINGLETONPROVIDER_H
