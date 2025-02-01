//
// Created by pijon on 12/9/24.
//

#ifndef CONFIGURATION_H
#define CONFIGURATION_H

#include "abstract/IConfiguration.h"

#include <optional>

namespace http_uploader::configuration {

class Configuration : public abstract::IConfiguration {
public:
    std::string location() override;
    unsigned long long max_size() override;
    unsigned int port() override;
private:
    static std::string formatAsDirectory(std::string_view path);
    static std::optional<std::string> getEnv(const char *name);
};

} // constants
// http_uploader

#endif //CONFIGURATION_H
