object "Solver" {
    code { 
        let runtime_size := datasize("runtime")
        let runtime_offset := dataoffset("runtime")
        datacopy(0, runtime_offset, runtime_size)
        return(0, runtime_size)
    }

    object "runtime" {
        code {
            mstore(0x80, 0x2a)
            // return value at 0 memory address of size 32 bytes
            return(0x80, 32) 
        }
    }
}