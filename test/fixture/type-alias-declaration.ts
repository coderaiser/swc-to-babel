type A = {
    readonly [Key in keyof Type]: Type[Key];
}

type __a = {[__b in keyof __c]?: __c[__b];}

