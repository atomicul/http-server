cmake_minimum_required(VERSION 3.30)
project(main)

set(CMAKE_CXX_STANDARD 20)

add_executable(main main.cpp
        configuration/abstract/IConfiguration.h
        configuration/Configuration.cpp
        configuration/Configuration.h
        SingletonProvider.cpp
        SingletonProvider.h)

find_package(Crow REQUIRED CONFIG)
target_link_libraries(main PRIVATE Crow::Crow asio::asio)
