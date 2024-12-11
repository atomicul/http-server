#include <iostream>

#include <crow.h>
#include <crow/middlewares/cors.h>

#include "SingletonProvider.h"

using namespace http_uploader;

int main() {
    crow::App<crow::CORSHandler> app;

    auto *config = SingletonProvider::configuration();

    CROW_ROUTE(app, "/<string>").methods(crow::HTTPMethod::Post)([config](const crow::request &req, const std::string &name) {
        if (req.body.size() > config->max_size())
            return crow::response(413);

        const std::string save_location = config->location() + name;

        if (!std::filesystem::exists(save_location)) {
            std::ofstream(save_location) << req.body;

            return crow::response(204);
        }

        constexpr int max_loop = INT_MAX;
        for (int i = 1; i<max_loop; i++) {
            const std::string new_location = (std::stringstream() << save_location << " (" << i << ")").str();
            if (!std::filesystem::exists(new_location)) {
                std::ofstream(new_location) << req.body;
                return crow::response(204);
            }
        }

        return crow::response(500);
    });

    app
    .port(config->port())
    .multithreaded()
    .run();
}
