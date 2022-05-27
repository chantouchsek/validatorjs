# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.0.5](https://github.com/chantouchsek/validator-js/compare/v1.0.4...v1.0.5) (2022-05-27)


### Bug Fixes

* change key code from km to kh ([fc0e064](https://github.com/chantouchsek/validator-js/commit/fc0e064b89c40aa0794cfb188ad3f1cba1be2661))
* **deps:** bump actions/setup-node from 3.1.1 to 3.2.0 ([510f24b](https://github.com/chantouchsek/validator-js/commit/510f24b3908fb851e5a42df0644efc7a49daac42))

### [1.0.4](https://github.com/chantouchsek/validator-js/compare/v1.0.3...v1.0.4) (2022-04-30)

### [1.0.3](https://github.com/chantouchsek/validator-js/compare/v1.0.2...v1.0.3) (2022-04-30)


### Bug Fixes

* add ts-node ([4def6dc](https://github.com/chantouchsek/validator-js/commit/4def6dcfda3dafa39704537536eba78089e10e78))
* **deps:** bump actions/checkout from 2.4.0 to 3.0.2 ([e64c8c7](https://github.com/chantouchsek/validator-js/commit/e64c8c7030a11f502c3b511d6c57cb605ab85ad7))
* **deps:** bump actions/setup-node from 2.5.1 to 3.1.1 ([5192f4c](https://github.com/chantouchsek/validator-js/commit/5192f4ccba6d27abbfdd79121b7a91b9d11a24ff))
* **deps:** bump actions/stale from 4 to 5 ([2abf89a](https://github.com/chantouchsek/validator-js/commit/2abf89a7245a38e1b9a6b59be8b218255f5988b0))
* **deps:** bump github/codeql-action from 1 to 2 ([a2db7c1](https://github.com/chantouchsek/validator-js/commit/a2db7c105de307cce839a0cae3181f665d0e5cb1))
* **deps:** bump minimist from 1.2.5 to 1.2.6 ([f8aaf29](https://github.com/chantouchsek/validator-js/commit/f8aaf29cc17fb98bf4048d8a150897b3e85c635c))

### [1.0.2](https://github.com/chantouchsek/validator-js/compare/v1.0.1...v1.0.2) (2022-01-18)


### Bug Fixes

* :fire: fix linting ([32013a0](https://github.com/chantouchsek/validator-js/commit/32013a0057e1ed3a1424b3a1f6d06a69e0ea22d7))
* change export and typing folder ([d04186e](https://github.com/chantouchsek/validator-js/commit/d04186e237383455c3ea4f0c78dbbda3897800e3))
* make export default of all lang file ([d88200a](https://github.com/chantouchsek/validator-js/commit/d88200a1da39d7f44e361849e2905a34076d0faa))

### [1.0.1](https://github.com/chantouchsek/validator-js/compare/v1.0.0...v1.0.1) (2022-01-02)


### Bug Fixes

* :beer: change targe build to es2019 ([b9e6712](https://github.com/chantouchsek/validator-js/commit/b9e671260cc33e2bd5e432c99f38e515b0d568f1))

### [1.0.0](https://github.com/chantouchsek/validator-js/compare/v0.0.7...v1.0.0) (2022-01-01)

### Breaking Changes

- From

```js
const validator = new Validator({
  input,
  rules,
  customMessage: {},
  customAttributes: {},
  locale: 'en',
  confirmedReverse: true,
})
```

- to

```js
const options = {
  customMessage: {},
  customAttributes: {},
  locale: 'en',
  confirmedReverse: true,
}
const validator = new Validator(input, rules, options)
```

### Features

- :beer: add password
  rule ([d9c597b](https://github.com/chantouchsek/validator-js/commit/d9c597bf24778b5288ff210e48240132ae25ad6a))
- :rocket: add ton of translation file and
  tests ([6e49c81](https://github.com/chantouchsek/validator-js/commit/6e49c815639d96f9c00ece71c0e3a1811667b3dd))
- :rocket: re-write in
  typescript ([cc74636](https://github.com/chantouchsek/validator-js/commit/cc74636540672039d443dc39a1feef518a170c2f))
- :zap: add validated()
  method ([a6b1bc3](https://github.com/chantouchsek/validator-js/commit/a6b1bc3e7bebaa049e20cf2885c9478d7a142490))
- add accept and after
  rules ([ea58f10](https://github.com/chantouchsek/validator-js/commit/ea58f10098ac6cc4acbd6dc967a9d957b18bf39a))
- add after_or_equal
  rule ([62230a9](https://github.com/chantouchsek/validator-js/commit/62230a95bd58a8207d3ebfe03f2b94f81a9c23b3))
- add alpha
  rule ([aa6dc3e](https://github.com/chantouchsek/validator-js/commit/aa6dc3e5ce5b380f1eeac777c95a582bc8f735c0))
- add alpha_dash and alpha_num
  rule ([51d453e](https://github.com/chantouchsek/validator-js/commit/51d453edf47681a7d10212e3422f076309bea3c8))
- add uzbek
  translation ([b168791](https://github.com/chantouchsek/validator-js/commit/b1687917531fca3756d8f36d7fddb7ab727beb5f))

### Bug Fixes

- :beer: add documentation for sometimes rule, and fix nested sometimes
  bug ([ab98fae](https://github.com/chantouchsek/validator-js/commit/ab98fae02fca1579f5b68178a905eb0d817236a3))
- :beer: make readme is update and remove types BREAKING CHANGE: fix readme
  file ([add193c](https://github.com/chantouchsek/validator-js/commit/add193c528980dcd5e643f59149e22c8aa637c6e))
- :fire: remove console from
  test ([9935be6](https://github.com/chantouchsek/validator-js/commit/9935be6996b8f298258dddbf7cf43dbcb84548a9))
- :rocket: BREAKING CHANGE: replace message that has dot to empty
  space ([f6af033](https://github.com/chantouchsek/validator-js/commit/f6af0338eb82a18cce13c957424794d76871af2f))
- :tada: Make first email regex support UTF-8 and change regex
  algorithm ([ff9dc87](https://github.com/chantouchsek/validator-js/commit/ff9dc877d902f95f660d08826c234cb68184e344))
- fix main path of build
  directory ([a2ea153](https://github.com/chantouchsek/validator-js/commit/a2ea15319d99ab1da016847152228609a72bfe95))
- fix numeric related
  rules ([dc492f7](https://github.com/chantouchsek/validator-js/commit/dc492f76fe9750a22b56ca9d419bcdc0514fc6c5))
- some typos ([1f63e62](https://github.com/chantouchsek/validator-js/commit/1f63e62bb9435561ae54454443b2b6a8d49b7cc7))

### [0.0.5](https://github.com/Chantouch/validator-js/compare/v0.0.4...v0.0.5) (2020-09-21)

### [0.0.4](https://github.com/Chantouch/validator-js/compare/v0.0.3...v0.0.4) (2020-09-21)

### [0.0.3](https://github.com/Chantouch/validator-js/compare/v0.0.2...v0.0.3) (2020-09-21)

### [0.0.2](https://github.com/Chantouch/validator-js/compare/v0.0.1...v0.0.2) (2020-07-23)

### 0.0.1 (2020-07-23)
