class Counter extends HTMLElement {
	static #idCounter = 0;
	#idPrefix = `my-counter-${Counter.#idCounter++}`;
	#decrementElementId = `${this.#idPrefix}decrement`;
	#incrementElementId = `${this.#idPrefix}increment`;
	#countElementId = `${this.#idPrefix}count`;

	#shadow = this.attachShadow({ mode: 'closed' });
	count = 0;
	min = 0;

	constructor() {
		super();
	}

	connectedCallback() {
		this.#shadow.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 8px;

          user-select: none;
        }

        button {
          border: none;
          background: #333;
          border-radius: 4px;
          width: 48px;
          height: 48px;
          color: #eee;
          font-size: 32px;
          line-height: 32px;
          cursor: pointer;
        }

        span {
          font-size: 32px;
          line-height: 32px;
          font-weight: bold;
          min-width: 64px;
          text-align: center;
        }
      </style>

      <button id="${this.#decrementElementId}" type="button">-</button>
      <span id="${this.#countElementId}">${this.count}</span>
      <button id="${this.#incrementElementId}" type="button">+</button>
    `;

		const decrementElement = this.#shadow.getElementById(
			this.#decrementElementId
		);
		const incrementElement = this.#shadow.getElementById(
			this.#incrementElementId
		);

		decrementElement.addEventListener('click', (e) => {
			e.stopPropagation();
			this.count--;
			if (this.count < this.min) {
				this.count = this.min;
			}

			this.#render();
			this.#emitEvent();
		});

		incrementElement.addEventListener('click', (e) => {
			e.stopPropagation();
			this.count++;

			this.#render();
			this.#emitEvent();
		});
	}

	attributeChangedCallback(property, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		this[property] = newValue;

		this.#validateInputs();
		this.#render();
	}

	static get observedAttributes() {
		return ['count', 'min'];
	}

	#emitEvent() {
		this.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
				cancelable: true,
				detail: this.count,
			})
		);
	}

	#validateInputs() {
		if (this.count < this.min) {
			this.count = this.min;
		}
	}

	#render() {
		const countElement = this.#shadow.getElementById(this.#countElementId);
		if (!countElement) {
			// Element will not be present on the first `attributeChangedCallback` call
			return;
		}

		countElement.textContent = this.count;
	}
}

customElements.define('my-counter', Counter);
