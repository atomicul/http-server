//
// Created by pijon on 12/9/24.
//

#include "Configuration.h"

#include <climits>
#include <regex>

namespace http_uploader::configuration {
std::string Configuration::location() {
  return formatAsDirectory(getEnv("SAVE_DIRECTORY").value_or("/uploads"));
}

unsigned long long Configuration::max_size() {
  const unsigned long long num = std::stoull(getEnv("MAX_FILE_SIZE").value_or("0"));
  if (num == 0)
    return ULLONG_MAX;
  return num;
}

unsigned int Configuration::port() { return std::stoi(getEnv("PORT").value_or("3001")); }

std::optional<std::string> Configuration::getEnv(const char *name) {
  const char *value = std::getenv(name);
  if (value == nullptr)
      return std::nullopt;

  return value;
}

std::string Configuration::formatAsDirectory(std::string_view path) {
  bool match = std::regex_match(path.begin(), path.end(),
                                std::regex(R"regex(^(.*)\/([^\/]+)$)regex"));

  if (!match)
    throw std::invalid_argument("Cannot parse path");

  if (path.end()[-1] == '/')
    return std::string{path};
  return std::string{path} + "/";
}
} // namespace http_uploader::configuration
// http_uploader
