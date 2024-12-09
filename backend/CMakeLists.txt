cmake_minimum_required(VERSION 3.30)
project(main)

set(CMAKE_CXX_STANDARD 20)

include_directories(include)

add_executable(main main.cpp
        configuration/abstract/IConfiguration.h
        configuration/Configuration.cpp
        configuration/Configuration.h
        SingletonProvider.cpp
        SingletonProvider.h)

find_package(asio CONFIG REQUIRED)
find_package(Crow CONFIG REQUIRED)
target_link_libraries(main PUBLIC Crow::Crow asio::asio)