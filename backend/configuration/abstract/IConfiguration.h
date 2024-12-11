#ifndef ICONSTANTS_H
#define ICONSTANTS_H

#include <string>

namespace http_uploader::configuration::abstract {

class IConfiguration {
public:
    virtual std::string location() = 0;
    virtual unsigned long long max_size() = 0;
    virtual unsigned int port() = 0;

    virtual ~IConfiguration() = default;
};

} // abstract
// constants
// http_uploader

#endif //ICONSTANTS_H
