/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
.setOptions({
  java_package: "com.lianggzone.netty.proto.response",
  java_outer_classname: "ResponseMessageProtocols"
})
.addJSON({
  RequestAuthenticationProtocol: {
    fields: {
      Token: {
        rule: "required",
        type: "string",
        id: 1
      }
    }
  },
  RequestChatProtocol: {
    fields: {
      Header: {
        rule: "required",
        type: "CommonHeader",
        id: 1
      },
      Body: {
        type: "bytes",
        id: 2
      }
    },
    nested: {
      CommonHeader: {
        fields: {
          Command: {
            rule: "required",
            type: "uint32",
            id: 1
          },
          SeqId: {
            rule: "required",
            type: "string",
            id: 2
          },
          Version: {
            rule: "required",
            type: "string",
            id: 3
          },
          FromUid: {
            rule: "required",
            type: "string",
            id: 4
          }
        }
      }
    }
  },
  RequestMessageProtocol: {
    fields: {
      From: {
        rule: "required",
        type: "string",
        id: 1
      },
      To: {
        rule: "required",
        type: "string",
        id: 2
      },
      Type: {
        rule: "required",
        type: "uint32",
        id: 3
      },
      BusinessType: {
        rule: "required",
        type: "uint32",
        id: 4
      },
      Content: {
        rule: "required",
        type: "string",
        id: 5
      }
    }
  },
  RequestSubscribeProtocol: {
    fields: {
      ArraySubscribe: {
        rule: "repeated",
        type: "Subscribes",
        id: 1
      }
    },
    nested: {
      Subscribes: {
        fields: {
          TopicId: {
            rule: "required",
            type: "string",
            id: 1
          },
          TopicType: {
            rule: "required",
            type: "uint32",
            id: 2
          }
        }
      }
    }
  },
  ResponseChatProtocol: {
    fields: {
      Header: {
        rule: "required",
        type: "CommonHeader",
        id: 1
      },
      Body: {
        type: "bytes",
        id: 2
      }
    },
    nested: {
      CommonHeader: {
        fields: {
          Command: {
            rule: "required",
            type: "uint32",
            id: 1
          },
          SeqId: {
            rule: "required",
            type: "string",
            id: 2
          },
          Version: {
            rule: "required",
            type: "string",
            id: 3
          },
          Status: {
            rule: "required",
            type: "uint32",
            id: 4
          },
          TerverTime: {
            rule: "required",
            type: "string",
            id: 5
          },
          Message: {
            type: "string",
            id: 6
          }
        }
      }
    }
  },
  ResponseMessageProtocol: {
    fields: {
      Id: {
        rule: "required",
        type: "string",
        id: 1
      },
      Time: {
        rule: "required",
        type: "string",
        id: 2
      },
      From: {
        rule: "required",
        type: "string",
        id: 3
      },
      To: {
        rule: "required",
        type: "string",
        id: 4
      },
      Type: {
        rule: "required",
        type: "uint32",
        id: 5
      },
      BusinessType: {
        rule: "required",
        type: "uint32",
        id: 6
      },
      Content: {
        rule: "required",
        type: "string",
        id: 7
      },
      Status: {
        rule: "required",
        type: "uint32",
        id: 8
      }
    }
  }
});

export default $root
