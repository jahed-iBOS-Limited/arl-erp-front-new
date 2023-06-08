package main

import (
   "RPC/common"
   "net/rpc"
   "net"
   "log"
   "fmt"
)

type Arith int
a := 10

func (a *Arith) Multiply(args *common.Args, reply *common.Result) error {
   *reply = common.Result(args.A * args.B)
   return nil
}

func main() {
   arith  := new(Arith)
   rpc.Register(arith)

   l, err := net.Listen("tcp", ":8025")

   if err != nil {
      log.Fatal(err)
   }
   fmt.Println("Server started...")
   for {
      conn, err := l.Accept()
      fmt.Println("Client called...")
      if err != nil {
         log.Fatal(err)
      }
      go rpc.ServeConn(conn)
   }
}