export default (await import('vue')).defineComponent({
name: 'Login',
data() {
return {
loginForm: {
mobile: '',
password: '',
isAgree: false
},
loginRules: {
mobile: [{
required: true,
message: 'The mobile phone number can not be empty',
trigger: blur // 触发模式  change(变化时)/blur(失去焦点时)
},
{
pattern: /^1[3-9]\d{9}$/,
message: 'The format of the mobile phone number is incorrect',
trigger: blur
}
],
password: [
{
required: true,
message: 'The passsword can not be empty',
}
],
isAgree: []
}
};
}
});
