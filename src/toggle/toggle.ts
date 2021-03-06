import { Component, Input, Inject, forwardRef } from "@angular/core";

import { connectToggle } from "instantsearch.js/es/connectors";
import { BaseWidget } from "../base-widget";
import { NgAisInstantSearch } from "../instantsearch/instantsearch";
import { noop } from "../utils";

export type ToggleState = {
  createURL: Function;
  refine: Function;
  value: {
    name?: string;
    count?: number;
    isRefined?: boolean;
  };
};

@Component({
  selector: "ais-toggle",
  template: `
    <div [class]="cx()">
      <ul [class]="cx('list')">
        <li
          [class]="cx('item')"
          (click)="handleClick($event)">
          <label [class]="cx('label')">
            <input
              [class]="cx('checkbox')"
              type="checkbox"
              value="{{state.value.name}}"
              [checked]="state.value.isRefined"
            />

            <span [class]="cx('labelText')">
              {{label || state.value.name}}
            </span>

            <span [class]="cx('count')">{{state.value.count}}</span>
          </label>
        </li>
      </ul>
    </div>
  `
})
export class NgAisToggle extends BaseWidget {
  // connector options
  @Input() public attribute: string;
  @Input() public label: string;
  @Input()
  public values: { on?: boolean; off?: boolean } = { on: true, off: undefined };

  public state: ToggleState = {
    createURL: noop,
    refine: noop,
    value: {}
  };

  constructor(
    @Inject(forwardRef(() => NgAisInstantSearch))
    public instantSearchParent: any
  ) {
    super("ToggleRefinement");
  }

  public ngOnInit() {
    this.createWidget(connectToggle, {
      attributeName: this.attribute,
      label: this.label,
      values: this.values
    });
    super.ngOnInit();
  }

  public handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.state.refine(this.state.value);
  }
}
