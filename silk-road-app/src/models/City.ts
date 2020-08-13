import {observable} from "mobx";

export class City {
    coords: [number, number];
    name: string;
    @observable isSelected: boolean = false;

    constructor(name: string, coords: [number, number]) {
        this.coords = coords;
        this.name = name;
    }
}
